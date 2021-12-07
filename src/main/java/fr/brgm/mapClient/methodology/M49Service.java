package fr.brgm.mapClient.methodology;

import com.fasterxml.jackson.databind.ObjectMapper;
import fr.brgm.mapClient.methodology.dto.M49DTO;
import lombok.AllArgsConstructor;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class M49Service {

    private final static Log log = LogFactory.getLog(M49Service.class);

    /**
     * Mapper for m49 objects
     */
    private ObjectMapper m49Mapper;

    /**
     * Get all M49 codes and names
     *
     * @return all M49 codes and names
     */
    public List<M49DTO> readM49MethodologyAsJson() throws IOException {
        // Récupération du fichier de logs dans le classpath
        ClassPathResource classPathResource = new ClassPathResource("methodology-m49/UNSD___Methodology.json");
        M49DTO[] m49DTOS = this.m49Mapper.readValue(classPathResource.getInputStream(), M49DTO[].class);

        return Arrays.stream(m49DTOS)
                .collect(Collectors.toList());
    }

}
