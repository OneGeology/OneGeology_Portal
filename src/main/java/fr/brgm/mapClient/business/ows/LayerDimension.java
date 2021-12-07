package fr.brgm.mapClient.business.ows;


import lombok.Data;

@Data
public class LayerDimension {

    private String name;
    private String units;
    private String defaultValue;
    private String nearestValue;
    private String values;
    private String multipleValues;
}
