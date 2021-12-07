package fr.brgm.mapClient.utils.velocity;

import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.runtime.RuntimeConstants;

import java.io.StringWriter;
import java.util.Properties;

/**
 * Creates XML with Velocity.
 */
public class VelocityCreator {

    public static String CATEGORY_NAME = "org.apache.velocity.runtime.log.SimpleLog4JLogSystem";

    /**
     * Creates XML with Velocity.
     *
     * @param context      Velocity Context for the XML.
     * @param templateName TemplateDTO to Use to create the XML.
     * @return Created XML.
     * @throws Exception
     */
    public static String createXMLbyContext(VelocityContext context, String templateName) throws Exception {

        VelocityEngine ve = new VelocityEngine();
        try {
            Properties p = new Properties();
            p.setProperty("resource.loader", "class");
            p.setProperty("class.resource.loader.description", "Resource Loader");
            p.setProperty("class.resource.loader.class", "org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader ");

            p.setProperty(RuntimeConstants.RUNTIME_LOG_LOGSYSTEM_CLASS, "org.apache.velocity.runtime.log.SimpleLog4JLogSystem");
            p.setProperty("runtime.log.logsystem.log4j.category", CATEGORY_NAME);

            ve.init(p);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        Template template = ve.getTemplate(templateName);
        StringWriter writer = new StringWriter();
        template.merge(context, writer);
        return writer.toString().trim();
    }
}