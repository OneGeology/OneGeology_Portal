package fr.brgm.mapClient.wms.validation.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Status after validating a WMS
 */
@Data
public class WmsStatusDTO {

    /**
     * Indicates if the WMS is valid
     */
    private boolean valid;

    /**
     * Global error
     * Can be an error while getting the WMS, ...
     */
    public String error;

    /**
     * List of the errors by layer
     */
    private Map<String, List<WmsErrorDTO>> errors;

    /**
     * Add an error to a layer
     *
     * @param layerName Name of the layer
     * @param message   Error message
     */
    public void addError(String layerName, String message) {
        if (this.errors == null) {
            this.errors = new HashMap<>();
        }
        this.errors.computeIfAbsent(layerName, k -> new ArrayList<>());
        this.errors.get(layerName).add(new WmsErrorDTO(message));
    }

    /**
     * Indicates if at least 1 error exists
     *
     * @return True if at least 1 error exists, false otherwise
     */
    public boolean hasError() {
        return this.errors != null && this.errors.size() > 0;
    }
}
