package fr.brgm.mapClient.methodology;

import fr.brgm.mapClient.methodology.dto.M49DTO;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;
import java.util.List;

/**
 * Test class for {@link M49Service}
 */
@RunWith(SpringRunner.class)
@SpringBootTest
public class M49ServiceIntegrationTest {

    /**
     * Service to test
     */
    @Autowired
    private M49Service m49Service;

    /**
     * Testing readM49MethodologyAsJson
     */
    @Test
    public void whenReadM49MethodologyAsJsonShouldMapCorrectlyEachEntry() throws IOException {
        List<M49DTO> m49DTOS = this.m49Service.readM49MethodologyAsJson();
        Assert.assertNotNull(m49DTOS);

        M49DTO m49France = m49DTOS.stream()
                .filter(m49DTO -> "France".equals(m49DTO.getCountryOrArea()))
                .findFirst()
                .orElse(null);
        Assert.assertNotNull(m49France);
    }

}
