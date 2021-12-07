/******************************************************************
Filename: ProxyRedirect.java
Document Type: Java servlet
Purpose: This servlet will write the body content of a request to a file.
 *        The file name is returned as the response.
 *        Set the output directory as servlet init-param in web.xml
 
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: ProxyRedirect.java,v 1.1 2009/09/16 14:53:31 mauclerc Exp $
 **************************************************************************/
package fr.brgm.mapClient.proxy;

import fr.brgm.mapClient.config.properties.ApplicationProperties;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.support.SpringBeanAutowiringSupport;

import javax.imageio.ImageIO;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLDecoder;

@WebServlet(urlPatterns = "/proxycesium", loadOnStartup = 1)
public class ProxyCesium extends HttpServlet {

	/**
	 * Log
	 */
	private final static Log log = LogFactory.getLog(ProxyCesium.class);

	@Autowired
	private ApplicationProperties applicationProperties;

	/**
	 * Current servlet context
	 */
	public ServletContext context_ = null;


	/**
	 * Initialize variables called when context is initialized.
	 */
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		SpringBeanAutowiringSupport.processInjectionBasedOnServletContext(this, config.getServletContext());
		context_ = config.getServletContext();
		log.info("ProxyCesium: context initialized to:" + context_.getServletContextName());
		log.debug(String.format("Cesium exception : %s",this.applicationProperties.getCesiumExceptionUrl()));
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest,
	 *      HttpServletResponse)
	 */
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

		String charenc = req.getCharacterEncoding() != null ? req.getCharacterEncoding() : "UTF-8";
		String callup = "";

		// Read URL
		callup = URLDecoder.decode((req.getParameter("url") == null ? "" : "" + req.getParameter("url")), charenc);

		// Call URL
		URL url = new URL(callup);

		// Test for redirect on unknown servers
		HttpURLConnection con = (HttpURLConnection) url.openConnection();
		con.setRequestMethod("GET");
		con.connect();
		if (con.getResponseCode() == 302 && con.getHeaderField("Location") != null) {
			// Redirect found!
			url = new URL(con.getHeaderField("Location"));
		}

		// Connect
		HttpURLConnection httpConnection = (HttpURLConnection)url.openConnection();
		BufferedImage img = ImageIO.read(httpConnection.getInputStream());
		resp.setContentType("image/png");
		OutputStream outStream = resp.getOutputStream();
		ImageIO.write(img, "png", outStream);
		outStream.flush();
		outStream.close();
	}
}
