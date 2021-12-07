package fr.brgm.mapClient.sld;

import fr.brgm.mapClient.sld.dao.SldAttributesDAO;
import fr.brgm.mapClient.sld.dto.SldAttributesDTO;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = OgcFilterMapper.class)
public interface SldAttributesMapper {

    SldAttributesDTO toSldAttributesDto(SldAttributesDAO sldAttributesDAO);

    @InheritInverseConfiguration
    SldAttributesDAO toSldAttributesDao(SldAttributesDTO sldAttributesDTO);
}
