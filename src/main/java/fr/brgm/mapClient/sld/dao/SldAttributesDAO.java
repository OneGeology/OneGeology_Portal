package fr.brgm.mapClient.sld.dao;

import lombok.Data;

import java.util.List;

@Data
public class SldAttributesDAO {

    private String fileName;

    private String sldName;
    // geosciml or erml
    private String queryableThematic;
    private List<OgcFilterDAO> filters;
    private String colorFill;
}
