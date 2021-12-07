package fr.brgm.mapClient.methodology;

import fr.brgm.mapClient.methodology.dto.M49DTO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

/**
 * Rest controller to get M49 methodology
 */
@RestController
@AllArgsConstructor
@RequestMapping("/methodology/m49")
@Api(value = "/methodology/m49", description = "Controller used to get M49 methodology")
public class M49Controller {

    /**
     * Service to get M49 codes
     */
    private M49Service m49Service;

    /**
     * Get all M49 codes and names
     *
     * @return all M49 codes and names
     */
    @GetMapping("/")
    @ApiOperation(value = "Get all M49 codes and names", httpMethod = "GET", response = M49DTO.class, responseContainer = "List")
    @ApiResponse(code = 200, response = M49DTO.class, responseContainer = "List", message = "Responce class containing all M49 codes and names")
    public List<M49DTO> readM49MethodologyAsJson() throws IOException {
        return this.m49Service.readM49MethodologyAsJson();
    }

}
