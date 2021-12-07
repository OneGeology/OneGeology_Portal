package fr.brgm.mapClient.wfs;

import fr.brgm.mapClient.wfs.dto.WfsAttributesDAO;
import fr.brgm.mapClient.wfs.exception.WfsException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@AllArgsConstructor
public class WfsService {

    /**
     * Le repository qui s'occupera des appels au générateur de WFS
     */
    private final WfsRepository wfsRepository;

    /**
     * Appel de la génération du WFS avec les paramètres en entrée
     *
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
    public String getWfs(String request, String bbox, String srs, String lang, String url, String typename, String version, String gsmlVersion, String filter) throws WfsException {
        // Set a default SRS is nothing have been setled up
        if (StringUtils.isEmpty(srs)) {
            srs = "EPSG:4326";
        }

        // Split BBOX
        if (StringUtils.isEmpty(bbox)) {
            bbox = "-180,-90,180,90";
        }

        WfsAttributesDAO wfsAttributesDAO = new WfsAttributesDAO();
        wfsAttributesDAO.setRequest(request);
        wfsAttributesDAO.setBbox(bbox);
        wfsAttributesDAO.setSrs(srs);
        wfsAttributesDAO.setLang(lang);
        wfsAttributesDAO.setUrl(url);
        wfsAttributesDAO.setTypename(typename);
        wfsAttributesDAO.setVersion(version);
        wfsAttributesDAO.setGsmlVersion(gsmlVersion);
        wfsAttributesDAO.setFilter(filter);

        return this.wfsRepository.getWfs(wfsAttributesDAO);
    }
}
