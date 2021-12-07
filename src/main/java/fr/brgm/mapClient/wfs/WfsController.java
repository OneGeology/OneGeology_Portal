package fr.brgm.mapClient.wfs;

import fr.brgm.mapClient.wfs.exception.WfsException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;

@RestController
@AllArgsConstructor
@RequestMapping("/wfs")
@Api(value = "/wfs", description = "API REST pour accéder aux scavengers")
public class WfsController {

    private final WfsService wfsService;

    /**
     * Appel de la génération du WFS avec les paramètres en entrée
     * @param request
     * @param bbox
     * @param srs
     * @param lang
     * @param url
     * @param typename
     * @param version
     * @param gsmlVersion
     * @param filter
     * @return Le WFS sous forme de String
     * @throws WfsException Il est impossible de communiquer avec le générateur de WFS
     */
    @PostMapping(value = "/")
    @ApiOperation(value = "Appel de la génération du WFS avec les paramètres en entrée", httpMethod = "POST", response = String.class)
    @ApiResponses({
            @ApiResponse(code = 200, response = String.class, message = "Le WFS sous forme de String"),
            @ApiResponse(code = 500, response = WfsException.class, message = "Il est impossible de communiquer avec le générateur de WFS")
    })

    public String getWFS(@RequestParam String request,
                         @RequestParam String bbox,
                         @RequestParam String srs,
                         @RequestParam String lang,
                         @RequestParam String url,
                         @RequestParam String typename,
                         @RequestParam String version,
                         @RequestParam String gsmlVersion,
                         @RequestParam String filter,
                         HttpServletResponse httpServletResponse) throws WfsException {

        if (request.equalsIgnoreCase("gsmlbbox")) {
            httpServletResponse.setContentType("application/xml");
            String ts = Long.toString(System.currentTimeMillis());
            httpServletResponse.setHeader("Content-Disposition", "attachment; filename=1GG-GSML-" + ts + ".xml");
        } else if (request.equalsIgnoreCase("stats")) {
            httpServletResponse.setContentType("application/json");
        }

        return this.wfsService.getWfs(request, bbox, srs, lang, url, typename, version, gsmlVersion, filter);
    }
}
