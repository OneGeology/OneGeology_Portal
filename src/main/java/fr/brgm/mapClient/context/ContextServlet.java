package fr.brgm.mapClient.context;

import fr.brgm.mapClient.business.wmc.Context;
import fr.brgm.mapClient.utils.layerTree.LayerList;
import fr.brgm.mapClient.utils.velocity.VelocityCreator;
import org.apache.commons.digester.Digester;
import org.apache.commons.digester.xmlrules.DigesterLoader;
import org.apache.velocity.VelocityContext;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.StringReader;
import java.nio.charset.StandardCharsets;
import java.util.Calendar;

/**
 * The type Context servlet.
 */
@WebServlet(urlPatterns = "/context", loadOnStartup = 1)
public class ContextServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    /**
     * @param request
     * @param response
     * @throws ServletException
     * @throws IOException
     */
    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String action = request.getParameter("request");
        Context context;

        HttpSession myHttpSession = request.getSession();
        context = (Context) myHttpSession.getAttribute("context");

        if (context == null) {
            context = new Context();
            myHttpSession.setAttribute("context", context);
        }

        try {
            //Export en kml par l'utilisateur -> telechargement du xml
            if (action.equalsIgnoreCase("savekml") || action.equalsIgnoreCase("savewmc")) {
                if (request.getParameter("fileName") != null) {
                    String fileName = request.getParameter("fileName");
                    String data = "<?xml version=\"1.0\" encoding=\"utf-8\" ?>";
                    data += request.getParameter("wmc");
                    data = data.replaceAll("&", "&amp;");

                    // générer le KML
                    if (action.equalsIgnoreCase("savekml")) {
                        data = convertToKml(data);
                    }

                    manageResponse(response, fileName, data);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * @param wmc
     * @return
     * @throws Exception
     */
    private String convertToKml(String wmc) throws Exception {
        VelocityContext contextWMC = new VelocityContext();
        LayerList list = null;
        try {
            Digester digester = DigesterLoader.createDigester(this.getClass().getClassLoader().getResource("mappingWMC.xml"));
            digester.setValidating(false);
            list = (LayerList) digester.parse(new StringReader(wmc));
        } catch (Exception e) {
            e.printStackTrace();
        }
        contextWMC.put("context", list);
        return VelocityCreator.createXMLbyContext(contextWMC, "velocity-template/kml.xml");
    }

    /**
     * @param response
     * @param fileName
     * @param data
     * @throws IOException
     */
    private void manageResponse(HttpServletResponse response, String fileName, String data) throws IOException {
        response.setHeader("Content-Type", "text/xml; charset=UTF-8");
        response.setHeader("Content-disposition", "attachment; filename=\"" + fileName + "\"");
        response.setHeader("Pragma", "no-cache");
        response.setIntHeader("Expires", -1);
        response.setHeader("Cache-Control", "no-cache");
        response.setDateHeader("Last-Modified", Calendar.DATE);
        response.getOutputStream().write(data.getBytes(StandardCharsets.UTF_8));
    }
}
