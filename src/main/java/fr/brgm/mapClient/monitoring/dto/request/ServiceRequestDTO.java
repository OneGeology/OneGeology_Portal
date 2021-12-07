package fr.brgm.mapClient.monitoring.dto.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.validation.constraints.NotEmpty;

@Data
@NoArgsConstructor
@ToString
@ApiModel(value = "ServiceRequestDTO", description = "ServiceDTO we need to create in order to monitor")
public class ServiceRequestDTO {

    /**
     * ServiceDTO name
     */
    @ApiModelProperty(value = "Name of the service")
    @NotEmpty
    private String name;

    /**
     * ServiceDTO URL
     */
    @ApiModelProperty(value = "URL of the service")
    @NotEmpty
    private String url;

    /**
     * Name of the scenario
     */
    @ApiModelProperty(value = "Name of the scenario")
    @NotEmpty
    private String scenarioName;

    /**
     * Name of the step (contained by the scenario)
     */
    @ApiModelProperty(value = "Name of the step (contained by the scenario)")
    @NotEmpty
    private String stepName;

    /**
     * Status code required by the the step in order to check the URL
     */
    @ApiModelProperty(value = "Status code required by the the step in order to check the URL")
    @NotEmpty
    private String stepStatusCode;

    /**
     * Name of the trigger referencing the scenario
     */
    @ApiModelProperty(value = "Name of the trigger referencing the scenario")
    @NotEmpty
    private String triggerName;
}
