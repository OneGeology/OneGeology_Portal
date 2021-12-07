package fr.brgm.mapClient.wfs.dto;

import lombok.Data;

@Data
public class WfsAttributesDAO {

    private String request;
    private String bbox;
    private String srs;
    private String lang;
    private String url;
    private String typename;
    private String version;
    private String gsmlVersion;
    private String filter;
}
