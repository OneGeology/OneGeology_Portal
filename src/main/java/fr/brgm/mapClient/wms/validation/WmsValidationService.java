package fr.brgm.mapClient.wms.validation;

import com.google.common.collect.Lists;
import fr.brgm.mapClient.config.properties.WmsValidationProperties;
import fr.brgm.mapClient.methodology.M49Service;
import fr.brgm.mapClient.methodology.dto.M49DTO;
import fr.brgm.mapClient.wms.validation.dto.CustomPredicateDTO;
import fr.brgm.mapClient.wms.validation.dto.WmsStatusDTO;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.ArrayUtils;
import org.geotools.ows.ServiceException;
import org.geotools.ows.wms.Layer;
import org.geotools.ows.wms.WMSCapabilities;
import org.geotools.ows.wms.WebMapServer;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Validation service for external WMS
 */
@Slf4j
@Service
@AllArgsConstructor
public class WmsValidationService {

    /**
     * Properties used to validate WMS
     */
    private final WmsValidationProperties wmsValidationProperties;

    /**
     * Service used to get m49 codes and names
     */
    private final M49Service m49Service;

    /**
     * Test if at least one keyword starts with a specific <code>name</code>
     *
     * @param strings Keywords list from WMS
     * @param name    Name required for validation
     * @return true if at least one keyword starts with a specific name else false
     */
    private boolean oneOfStringsStartsWith(List<String> strings, String name) {
        return strings.stream()
                .anyMatch(s -> s.startsWith(name));
    }

    /**
     * Test if at least one keyword match the prefix <code>name</code> and a suffix which is one value from <code>values</code>
     *
     * @param strings Keywords list from WMS
     * @param name    Name required for validation (ex: continent@)
     * @param values  Values required for validation (ex: Asia)
     * @return true if at least one keyword matches name + value
     */
    private boolean oneOfStringsEquals(List<String> strings, String name, List<String> values) {
        AtomicBoolean oneOfStringsEquals = new AtomicBoolean(false);
        // Trying to find the keyword for name parameter
        Optional<String> keyword = strings
                .stream()
                .filter(s -> s.startsWith(name))
                .findFirst();

        // If the keyword is found then we can verify its value
        keyword
                // First, we remove the prefix in order to check on possible values
                .map(s -> s.replace(name, ""))
                // Then we check
                .ifPresent(s -> oneOfStringsEquals.set(values.contains(s)));

        return oneOfStringsEquals.get();
    }

    /**
     * Creates a list of predicates for "valued" keywords (ex: continent@Asia)
     *
     * @param name   Prefix of keywords (ex: continent@)
     * @param values List of mandatory suffixes (ex: Asia)
     * @return 1 predicate for the prefix (ex: continent@) and 1 predicate for suffix (ex: Asia)
     */
    private List<CustomPredicateDTO<List<String>>> createPredicateFromValuedKeywords(String name, List<String> values, boolean conditionalKeyword) {

        List<CustomPredicateDTO<List<String>>> predicates = Lists.newArrayList();

        if (!conditionalKeyword) {
            Predicate<List<String>> predicateOnName = (List<String> strings) -> this.oneOfStringsStartsWith(strings, name);
            CustomPredicateDTO<List<String>> customPredicateOnName = new CustomPredicateDTO<>();
            customPredicateOnName.setPredicate(predicateOnName);
            customPredicateOnName.setErrorMessage(String.format("No keyword found with name starting with %s", name));
            predicates.add(customPredicateOnName);
        }

        Optional.ofNullable(values)
                .ifPresent(v -> {
                    Predicate<List<String>> predicateOnValues = (List<String> strings) -> this.oneOfStringsEquals(strings, name, values);
                    CustomPredicateDTO<List<String>> customPredicate = new CustomPredicateDTO<>();
                    customPredicate.setPredicate(predicateOnValues);
                    customPredicate.setErrorMessage(String.format("Wrong value found for keyword %s", name));
                    predicates.add(customPredicate);
                });

        return predicates;
    }

    /**
     * Creates a list of predicates for mandatory keywords
     *
     * @param values List of mandatory keywords
     * @return 1 predicate by mandatory keywords
     */
    private List<CustomPredicateDTO<List<String>>> createPredicateFromMandatoryKeywords(List<String> values) {
        return Optional.ofNullable(values)
                .map(Collection::stream)
                .orElse(Stream.empty())
                .map(value -> {
                    Predicate<List<String>> p = (List<String> strings) -> strings.contains(value);
                    CustomPredicateDTO<List<String>> customPredicateDTO = new CustomPredicateDTO<>();
                    customPredicateDTO.setPredicate(p);
                    customPredicateDTO.setErrorMessage(String.format("No keyword found with name %s", value));
                    return customPredicateDTO;
                })
                .collect(Collectors.toList());
    }

    /**
     * Validate an external WMS from its URL
     *
     * @param url URL of the WMS
     * @return The status of the validation
     */
    public WmsStatusDTO validateWms(String url) {
        Assert.hasText(url, "url must not be empty");

        WmsStatusDTO wmsStatusDTO = new WmsStatusDTO();
        wmsStatusDTO.setValid(false);

        // Get the m49 methodology codes and names
        List<M49DTO> m49DTOS = Lists.newArrayList();
        try {
            m49DTOS = this.m49Service.readM49MethodologyAsJson();
        } catch (IOException e) {
            // If we cannot read this file validation is KO
            wmsStatusDTO.setError("M49 methodology JSON file cannot be read");
            return wmsStatusDTO;
        }

        URL urlObject = null;
        try {
            urlObject = new URL(url);
        } catch (MalformedURLException e) {
            log.debug(String.format("MalformedURLException - %s", e.getMessage()));
            wmsStatusDTO.setError(e.getMessage());
            return wmsStatusDTO;
        }

        WebMapServer wms = null;
        try {
            // Getting and Mapping WMS
            wms = new WebMapServer(urlObject);
        } catch (IOException e) {
            //There was an error communicating with the server
            //For example, the server is down
            log.debug(String.format("IOException - %s", e.getMessage()));
            wmsStatusDTO.setError(e.getMessage());
            return wmsStatusDTO;
        } catch (ServiceException e) {
            //The server returned a ServiceException (unusual in this case)
            //Unable to parse the response from the server
            //For example, the capabilities it returned was not valid
            log.debug(String.format("ServiceException - %s", e.getMessage()));
            wmsStatusDTO.setError(e.getMessage());
            return wmsStatusDTO;
        }

        WMSCapabilities capabilities = wms.getCapabilities();
        String serverName = capabilities.getService().getName();
        String serverTitle = capabilities.getService().getTitle();
        log.debug(String.format("Capabilities retrieved from server: %s (%s)", serverName, serverTitle));

        // Creates Predicates for each mandatory keyword (see WmsValidationProperties)
        // and associates each Predicate with an error message (used if predicate does not match)
        List<CustomPredicateDTO<List<String>>> predicateFromMandatoryKeywords = this.createPredicateFromMandatoryKeywords(this.wmsValidationProperties.getChildLayerKeywords().getMandatory());

        // Creates Predicates for each "valued" keywords (see WmsValidationProperties)
        // and associates each Predicate with an error message (used if predicate does not match)
        WmsValidationProperties.MustContainType geographicArea = this.wmsValidationProperties.getChildLayerKeywords().getMustContain().getGeographicArea();
        // Now we can test values for geographicarea by checking with the m49 methodology
        List<String> countryNames = m49DTOS.stream()
                .map(M49DTO::getCountryOrArea)
                .collect(Collectors.toList());
        geographicArea.setValues(countryNames);
        WmsValidationProperties.MustContainType subarea = this.wmsValidationProperties.getChildLayerKeywords().getMustContain().getSubarea();
        WmsValidationProperties.MustContainType dataProvider = this.wmsValidationProperties.getChildLayerKeywords().getMustContain().getDataProvider();
        WmsValidationProperties.MustContainType serviceProvider = this.wmsValidationProperties.getChildLayerKeywords().getMustContain().getServiceProvider();
        WmsValidationProperties.MustContainType topic = this.wmsValidationProperties.getChildLayerKeywords().getMustContain().getTopic();
        WmsValidationProperties.MustContainType date = this.wmsValidationProperties.getChildLayerKeywords().getMustContain().getDate();
        List<List<CustomPredicateDTO<List<String>>>> predicateFromValuedKeywords = Stream.of(geographicArea, subarea, dataProvider, serviceProvider, topic, date)
                .map(mustContainType -> this.createPredicateFromValuedKeywords(mustContainType.getName(), mustContainType.getValues(), mustContainType.getConditional()))
                .collect(Collectors.toList());

        // Computes every Predicate
        capabilities.getLayerList()
                .stream()
                .map(Layer::getChildren)
                .flatMap(Arrays::stream)
                .forEach(layer -> {
                    // First we check if there are keywords
                    if (ArrayUtils.isEmpty(layer.getKeywords())) {
                        wmsStatusDTO.addError(layer.getName(), "No keywords found");
                    } else {
                        predicateFromMandatoryKeywords.forEach(customPredicateDTO -> {
                            // Testing predicates from mandatory keywords
                            boolean valid = customPredicateDTO.getPredicate().test(Arrays.asList(layer.getKeywords()));
                            if (!valid) {
                                // Adding error message
                                wmsStatusDTO.addError(layer.getName(), customPredicateDTO.getErrorMessage());
                            }
                        });

                        predicateFromValuedKeywords.forEach(customPredicateFromValuedKeywords -> {
                            customPredicateFromValuedKeywords.forEach(stringCustomPredicateDTO -> {
                                boolean valid = stringCustomPredicateDTO.getPredicate().test(Arrays.asList(layer.getKeywords()));
                                if (!valid) {
                                    // Adding error message
                                    wmsStatusDTO.addError(layer.getName(), stringCustomPredicateDTO.getErrorMessage());
                                }
                            });
                        });
                    }
                });

        // If an error is found, result is false
        if (wmsStatusDTO.hasError()) {
            return wmsStatusDTO;
        }

        // If no error was found, result is true
        wmsStatusDTO.setValid(true);
        return wmsStatusDTO;
    }
}
