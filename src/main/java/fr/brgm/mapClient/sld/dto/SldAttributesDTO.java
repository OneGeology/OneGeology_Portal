package fr.brgm.mapClient.sld.dto;

import lombok.Data;

import java.util.List;

@Data
public class SldAttributesDTO {

    private String fileName;

    private String sldName;
    // geosciml or erml
    private String queryableThematic;
    private List<OgcFilterDTO> filters;
    private String colorFill;

}
