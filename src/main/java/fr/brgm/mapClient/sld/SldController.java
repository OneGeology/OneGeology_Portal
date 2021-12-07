package fr.brgm.mapClient.sld;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.brgm.mapClient.sld.dao.SldFileDAO;
import fr.brgm.mapClient.sld.dto.OgcFilterDTO;
import fr.brgm.mapClient.sld.dto.ResultSldDTO;
import fr.brgm.mapClient.sld.dto.SldAttributesDTO;
import fr.brgm.mapClient.sld.exception.SldException;
import fr.brgm.mapClient.utils.file.FileWriter;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.AllArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * API REST pour accéder au générateur de SLD
 */
@RestController
@CommonsLog
@AllArgsConstructor
@RequestMapping("/sld")
@Api(value = "/sld", description = "API REST pour accéder au générateur de SLD")
public class SldController {

    /**
     * Service pour appel à la génération des SLDs
     */
    private final SldService sldService;

    /**
     * Génération du SLD à partir des paramètres en entrée
     *
     * @param layerid
     * @param color
     * @param queryableThematic
     * @param sldName
     * @param filters
     * @param httpServletRequest
     * @return L'emplacement du fichier SLD généré
     * @throws SldException Génération impossible
     * @throws IOException  Ecriture fichier impossible
     */
    @PostMapping(value = "/")
    @ApiOperation(value = "", httpMethod = "POST", response = String.class)
    @ApiResponses({
            @ApiResponse(code = 200, response = String.class, message = "")
    })
    public ResultSldDTO getWFS(@RequestParam String layerid,
                               @RequestParam String color,
                               @RequestParam String queryableThematic,
                               @RequestParam String sldName,
                               @RequestParam String filters,
                               HttpServletRequest httpServletRequest) throws SldException, IOException {

        // Mapping des filters
        List<OgcFilterDTO> ogcFilterDTOS = new ObjectMapper().readValue(filters, new TypeReference<List<OgcFilterDTO>>() {
        });
        String fileName = String.format("%s_%d_%s.sld", new SimpleDateFormat("yyyyMMdd").format(new Date()), System.currentTimeMillis(), layerid);

        SldAttributesDTO sldAttributesDTO = new SldAttributesDTO();
        sldAttributesDTO.setColorFill(color);
        sldAttributesDTO.setFileName(fileName);
        sldAttributesDTO.setFilters(ogcFilterDTOS);
        sldAttributesDTO.setQueryableThematic(queryableThematic);
        sldAttributesDTO.setSldName(sldName);

        SldFileDAO sldFileDAO = this.sldService.getSld(sldAttributesDTO);

        String grp = httpServletRequest.getRealPath("/");

        String fullPathToFile = String.format("%s%sslds%s%s", grp, File.separator, File.separator, fileName);
        log.debug("outSld= " + fullPathToFile);

        FileWriter.write(fullPathToFile, sldFileDAO.getBytes());

        ResultSldDTO resultSldDTO = new ResultSldDTO();
        resultSldDTO.setSld(String.format("/slds%s%s", File.separator, fileName));
        resultSldDTO.setLayerid(layerid);

        return resultSldDTO;
    }
}
