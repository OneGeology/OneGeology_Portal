package fr.brgm.mapClient.business.ows;

import lombok.Data;

import java.io.Serializable;

@Data
public class Format implements Serializable, Cloneable {

    private static final long serialVersionUID = 1;

    private boolean current;

    private long id;

    private String name;

    /**
     * @return the current
     */
    public boolean isCurrent() {
        return current;
    }

    /**
     * @param current the current to set
     */
    public void setCurrent(boolean current) {
        this.current = current;
    }

}
