package fr.brgm.mapClient.monitoring;

import fr.brgm.mapClient.monitoring.dao.ServiceDAO;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

/**
 * TestSld class for {@link ServiceRepository}
 */
@RunWith(SpringRunner.class)
@SpringBootTest
@Sql(executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD, scripts = {
        "classpath:service.sql"
})
public class ServiceRepositoryTest {

    @Autowired
    private ServiceRepository serviceRepository;

    /**
     * Testing findAll method
     */
    @Test
    public void whenFindAllServicesShouldreturnAllServices() {
        List<ServiceDAO> serviceDAOList = this.serviceRepository.findAll();
        Assert.assertEquals(2, serviceDAOList.size());
        // Testing first element
        ServiceDAO first = serviceDAOList.stream().filter(s -> "Service 1".equals(s.getName())).findFirst().orElse(null);
        Assert.assertNotNull(first);
        Assert.assertEquals("Service 1", first.getName());
        Assert.assertEquals((Float) 100f, first.getSla());
    }

    /**
     * Testing valid save method
     */
    @Test
    public void whenSaveServiceWithValidDataShouldReturnService() {
        ServiceDAO toSave = new ServiceDAO();
        toSave.setName("Service 3");
        toSave.setSla(80.80F);

        ServiceDAO saved = this.serviceRepository.save(toSave);
        Assert.assertNotNull(saved);
        Assert.assertEquals("Service 3", saved.getName());
        Assert.assertEquals((Float) 80.80f, saved.getSla());
    }

    /**
     * Testing save method with existing name
     * Should throw DataIntegrityViolationException
     */
    @Test
    public void whenSaveServiceWithExistingNameShouldUpdate() {
        ServiceDAO toSave = new ServiceDAO();
        toSave.setName("Service 1");
        toSave.setSla(0F);

        ServiceDAO saved = this.serviceRepository.save(toSave);
        Assert.assertNotNull(saved);
        Assert.assertEquals("Service 1", saved.getName());
        Assert.assertEquals((Float) 0f, saved.getSla());
    }

    /**
     * Testing save method without service name
     * Should throw DataIntegrityViolationException
     */
    @Test(expected = JpaSystemException.class)
    public void whenSaveServiceWithNameNullShouldThrowJpaSystemException() {
        ServiceDAO toSave = new ServiceDAO();
        toSave.setName(null);
        toSave.setSla(0F);

        this.serviceRepository.save(toSave);
    }

    /**
     * Testing save method without service sla
     * Should throw DataIntegrityViolationException
     */
    @Test(expected = DataIntegrityViolationException.class)
    public void whenSaveServiceWithSlaNullShouldThrowDataIntegrityViolationException() {
        ServiceDAO toSave = new ServiceDAO();
        toSave.setName("ServiceDTO");
        toSave.setSla(null);

        this.serviceRepository.save(toSave);
    }

}