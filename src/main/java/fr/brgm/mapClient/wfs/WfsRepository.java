package fr.brgm.mapClient.wfs;

import fr.brgm.mapClient.config.properties.ApplicationProperties;
import fr.brgm.mapClient.wfs.dto.WfsAttributesDAO;
import fr.brgm.mapClient.wfs.exception.WfsException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Repository
@AllArgsConstructor
public class WfsRepository {

    /**
     * Client REST
     */
    private final RestTemplate restTemplate;

    /**
     * Propriétés de l'application
     */
    private final ApplicationProperties applicationProperties;

    /**
     * Appel de la génération du WFS avec les paramètres <code>wfsAttributesDAO</code>
     *
     * @param wfsAttributesDAO Les paramètres pour la génération du WFS
     * @return Le WFS sous forme de String
     * @throws WfsException Il est impossible de communiquer avec le générateur de WFS
     */
    public String getWfs(WfsAttributesDAO wfsAttributesDAO) throws WfsException {
        String urlOgcTools = UriComponentsBuilder
                .fromUriString(this.applicationProperties.getOgcTools().getGetWfsUrl())
                .toUriString();

        try {
            return this.restTemplate.postForEntity(urlOgcTools, wfsAttributesDAO, String.class).getBody();
        } catch (RestClientException rce) {
            throw new WfsException(rce);
        }
    }
}
