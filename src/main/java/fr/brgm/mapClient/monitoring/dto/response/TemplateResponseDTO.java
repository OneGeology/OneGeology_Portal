package fr.brgm.mapClient.monitoring.dto.response;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * Response class containing all created Ids
 */
@Data
@NoArgsConstructor
@ToString
@ApiModel(value = "TemplateResponseDTO", description = "Response class containing all created Ids")
public class TemplateResponseDTO {

    /**
     * Id of the created template. If the template already exists we just get it
     */
    @ApiModelProperty(value = "Id of the created template. If the template already exists we just get it")
    @NotNull
    private Long templateId;

    /**
     * Id of the created application. If the application already exists we just get it
     */
    @ApiModelProperty(value = "Id of the created application. If the application already exists we just get it")
    @NotNull
    private Long applicationId;

    /**
     * Id of the created parent service. If the parent service already exists we just get it
     */
    @ApiModelProperty(value = "Id of the created parent service. If the parent service already exists we just get it")
    @NotNull
    private Long serviceClusterId;

    /**
     * List of the created services, scenarios, etc.. created
     */
    @ApiModelProperty(value = "List of the created services, scenarios, etc.. created")
    @NotNull
    private List<ServiceResponseDTO> services;
}
