package fr.brgm.mapClient.sld;

import fr.brgm.mapClient.sld.dao.OgcFilterDAO;
import fr.brgm.mapClient.sld.dto.OgcFilterDTO;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OgcFilterMapper {

    OgcFilterDTO toOgcFilterDto(OgcFilterDAO ogcFilterDAO);

    @InheritInverseConfiguration
    OgcFilterDAO toOgcFilterDao(OgcFilterDTO ogcFilterDTO);
}
