package fr.brgm.mapClient.business.ows;

import lombok.Data;

import java.io.Serializable;

@Data
public abstract class Style implements Serializable {

    private static final long serialVersionUID = 1;
    protected boolean current;
    protected long id;
    protected String title;

    public boolean isCurrent() {
        return current;
    }
}
