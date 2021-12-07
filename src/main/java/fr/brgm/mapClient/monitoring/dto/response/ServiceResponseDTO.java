package fr.brgm.mapClient.monitoring.dto.response;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.validation.constraints.NotNull;

/**
 * Response class for the service created (with Scenario, step and trigger)
 */
@Data
@NoArgsConstructor
@ToString
@ApiModel(value = "ServiceResponseDTO", description = "Response class for the service created (with Scenario, step and trigger)")
public class ServiceResponseDTO {

    /**
     * Id of the created scenario. If the scenario already exists we just get it
     */
    @ApiModelProperty(value = "Id of the created scenario. If the scenario already exists we just get it")
    @NotNull
    private Long scenarioId;

    /**
     * Id of the created trigger. If the trigger already exists we just get it
     */
    @ApiModelProperty(value = "Id of the created trigger. If the trigger already exists we just get it")
    @NotNull
    private Long triggerId;

    /**
     * Id of the created service to get SLA. If the service already exists we just get it
     */
    @ApiModelProperty(value = "Id of the created service to get SLA. If the service already exists we just get it")
    @NotNull
    private Long serviceId;
}
