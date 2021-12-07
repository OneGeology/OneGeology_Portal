package fr.brgm.mapClient.sld;

import fr.brgm.mapClient.config.properties.ApplicationProperties;
import fr.brgm.mapClient.sld.dao.SldAttributesDAO;
import fr.brgm.mapClient.sld.dao.SldFileDAO;
import fr.brgm.mapClient.sld.exception.SldException;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * Repository pour la génération des SLD
 */
@Repository
@AllArgsConstructor
public class SldRepository {

    /**
     * Client pour les appels REST
     */
    private final RestTemplate restTemplate;

    /**
     * Les propriétés de l'application
     */
    private final ApplicationProperties applicationProperties;

    /**
     * Récupère le fichier SLD généré par OGCTools
     *
     * @param sldAttributesDAO Les paramètres pour la génération du SLD
     * @return Le fichier SLD ainsi que son nom
     * @throws SldException Appel au WS OGCTools est impossible
     */
    public SldFileDAO getSld(SldAttributesDAO sldAttributesDAO) throws SldException {
        String urlOgcToolsSld = UriComponentsBuilder
                .fromUriString(this.applicationProperties.getOgcTools().getGetSldUrl())
                .toUriString();

        try {
            ResponseEntity<byte[]> responseEntity = this.restTemplate.postForEntity(urlOgcToolsSld, sldAttributesDAO, byte[].class);

            SldFileDAO sldFileDAO = new SldFileDAO();
            // Récupération du nom du fichier
            sldFileDAO.setFileName(responseEntity.getHeaders().getContentDisposition().getFilename());
            // Récupération du nom du fichier
            sldFileDAO.setBytes(responseEntity.getBody());
            return sldFileDAO;
        } catch (RestClientException rce) {
            throw new SldException(rce);
        }
    }
}
