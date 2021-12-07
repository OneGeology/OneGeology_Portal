package fr.brgm.mapClient.monitoring.dto.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

@Data
@NoArgsConstructor
@ToString
@ApiModel(value = "TemplateRequestDTO", description = "template containing services we need to create in zabbix in order to monitor services SLA")
public class TemplateRequestDTO {

    /**
     * Host Id. Template belongs to this host
     */
    @ApiModelProperty(value = "Host Id. Template belongs to this host")
    @NotNull
    private Long hostId;

    /**
     * Group Id. Template belongs to this group
     */
    @ApiModelProperty(value = "Group Id. Template belongs to this group")
    @NotNull
    private Long groupId;

    /**
     * Template name in zabbix
     */
    @ApiModelProperty(value = "Template name in zabbix")
    @NotEmpty
    private String templateName;

    /**
     * Application name in zabbix
     */
    @ApiModelProperty(value = "Application name in zabbix")
    @NotEmpty
    private String applicationName;

    /**
     * Services used to get SLA
     */
    @ApiModelProperty(value = "List of all services we need to monitor")
    @NotNull
    private List<ServiceRequestDTO> services;
}
