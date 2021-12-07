package fr.brgm.mapClient.sld.dto;

import lombok.Data;

import java.util.List;

@Data
public class OgcFilterDTO {

    private String propertyName;
    private List<String> values;
}
