package fr.brgm.mapClient.methodology.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(value = {
        "Developed "
})
public class M49DTO {

    @JsonProperty("Global Code")
    private long globalCode;
    @JsonProperty("Global Name")
    private String globalName;

    @JsonProperty("Region Code")
    private long regionCode;
    @JsonProperty("Region Name")
    private String regionName;

    @JsonProperty("Sub-region Code")
    private long subRegionCode;
    @JsonProperty("Sub-region Name")
    private String subRegionName;

    @JsonProperty("Intermediate Region Code")
    private long intermediateRegionCode;
    @JsonProperty("Intermediate Region Name")
    private String intermediateRegionName;

    @JsonProperty("Country or Area")
    private String countryOrArea;

    @JsonProperty("M49 Code")
    private String m49Code;
    @JsonProperty("ISO-alpha2 Code")
    private String isoAlpha2Code;
    @JsonProperty("ISO-alpha3 Code")
    private String isoAlpha3Code;

    @JsonProperty("Least Developed Countries (LDC)")
    private String leastDevelopedcountries;

    @JsonProperty("Land Locked Developing Countries (LLDC)")
    private String landLockedDevelopingCountries;

    @JsonProperty("Small Island Developing States (SIDS)")
    private String smallIslandDevelopingStates;

    @JsonProperty("FIELD17")
    private String field17;

}
