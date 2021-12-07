package fr.brgm.mapClient.business.ows;

import lombok.Data;

@Data
public class NamedStyle extends Style {

    private static final long serialVersionUID = 1L;

    private String description;

    private String name;

    private String legendURL;
}
