package fr.brgm.mapClient.sld;

import fr.brgm.mapClient.sld.dao.SldFileDAO;
import fr.brgm.mapClient.sld.dto.SldAttributesDTO;
import fr.brgm.mapClient.sld.exception.SldException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Service pour la génération des SLDs
 */
@Service
@AllArgsConstructor
public class SldService {

    /**
     * Repository pour la génération des SLDs
     */
    private final SldRepository sldRepository;

    /**
     * Mapper
     */
    private final SldAttributesMapper sldAttributesMapper;

    /**
     * Génération du SLD à partir des paramètres en entrée
     *
     * @param sldAttributesDTO Les paramètres pour la génération du SLD
     * @return Le fichier SLD ainsi que son nom
     * @throws SldException Génération impossible
     */
    public SldFileDAO getSld(SldAttributesDTO sldAttributesDTO) throws SldException {
        return this.sldRepository.getSld(this.sldAttributesMapper.toSldAttributesDao(sldAttributesDTO));
    }
}
