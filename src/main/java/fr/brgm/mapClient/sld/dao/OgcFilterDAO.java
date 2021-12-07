package fr.brgm.mapClient.sld.dao;

import lombok.Data;

import java.util.List;

@Data
public class OgcFilterDAO {

    private String propertyName;

    private List<String> values;
}
