package fr.brgm.mapClient.proxy;

import org.apache.commons.httpclient.Header;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Enumeration;

@WebServlet(urlPatterns = "/proxyxml", loadOnStartup = 1)
public class ProxyRedirect2 extends HttpServlet {

    /**
     * Log
     */
    private final static Log log = LogFactory.getLog(ProxyRedirect.class);

    /**
     * Current servlet context
     */
    public ServletContext context_ = null;

    /**
     * Initialize variables called when context is initialized.
     */
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        context_ = config.getServletContext();
        log.info("ProxyRedirect: context initialized to:" + context_.getServletContextName());
    }

    /**
     * @see javax.servlet.http.HttpServlet#doGet(javax.servlet.http.HttpServletRequest,
     * javax.servlet.http.HttpServletResponse)
     */
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doForward(req, resp);
    }

    /**
     * @see javax.servlet.http.HttpServlet#doPost(javax.servlet.http.HttpServletRequest,
     * javax.servlet.http.HttpServletResponse)
     */
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doForwardFromPost(req, resp);
    }

    protected void doForward(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String url = getParameter("url", req.getQueryString());
        if (url != null) {
            url = URLDecoder.decode(url, "UTF-8");
            log.debug("Forwarding get: " + url);
            URL target = new URL(url);
            URLConnection con = target.openConnection();
            resp.setContentType("text/html; charset=utf-8");

            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(
                    con.getInputStream(), StandardCharsets.UTF_8));
            String inputLine;
            while ((inputLine = bufferedReader.readLine()) != null) {
                if (inputLine.contains("<?xml")) {
                    String tmp = inputLine.substring(inputLine.indexOf("<?xml "), inputLine.indexOf("?>") + 2);
                    inputLine = inputLine.replace(tmp, "");
                    resp.getWriter().write(inputLine);
                    continue;
                }
                if (StringUtils.isNotEmpty(inputLine)) {
                    resp.getWriter().write(inputLine);
                }
            }
        }
    }

    protected void doForwardFromPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String url = null;
        if (req.getParameter("url") != null) {
            url = req.getParameter("url");
        } else if (req.getHeader("serverUrl") != null) {
            url = req.getHeader("serverUrl");
        }
        log.debug("url : " + url);
        if (url != null) {

            url = URLDecoder.decode(url, "UTF-8");
            log.debug("Forwarding post: " + url);

            PostMethod httppost = new PostMethod(url);
            httppost.setRequestHeader("Content-type", "text/xml; charset=utf-8");
            resp.setContentType("text/xml; charset=utf-8");
            // Transfer bytes from in to out
            String body = inputStreamAsString(req.getInputStream());

            HttpClient client = new HttpClient();

            Enumeration names = req.getParameterNames();
            while (names.hasMoreElements()) {
                String current = (String) names.nextElement();
                if (!current.equals("url")) {
                    log.debug("Set parameter: " + current + " = " + req.getParameter(current));
                    httppost.setParameter(current, req.getParameter(current));
                }
            }

            if (0 == httppost.getParameters().length) {
                log.debug("No Name/Value pairs found ... pushing as requestBody");
                httppost.setRequestBody(body);
            }
            if (log.isDebugEnabled()) {
                log.debug("Body = " + body);
                NameValuePair[] nameValuePairs = httppost.getParameters();
                log.debug("NameValuePairs found: " + nameValuePairs.length);
                for (int i = 0; i < nameValuePairs.length; ++i) {
                    log.debug("parameters:" + nameValuePairs[i].toString());
                }
            }
            // httppost.setRequestContentLength(PostMethod.CONTENT_LENGTH_CHUNKED);
            httppost.setFollowRedirects(false);
            client.executeMethod(httppost);
            if (log.isDebugEnabled()) {
                Header[] respHeaders = httppost.getResponseHeaders();
                for (int i = 0; i < respHeaders.length; ++i) {
                    String headerName = respHeaders[i].getName();
                    String headerValue = respHeaders[i].getValue();
                    log.debug("responseHeaders:" + headerName + "=" + headerValue);
                }
            }

            if (httppost.getStatusCode() == HttpStatus.SC_OK) {
                resp.setContentType("text/xml");
                IOUtils.copy(httppost.getResponseBodyAsStream(), resp.getOutputStream());
            } else if (httppost.getStatusCode() == HttpStatus.SC_MOVED_TEMPORARILY) {
                if (httppost.getResponseHeader("location") != null)
                    doForwardFromPostRedirected(req, resp, httppost.getResponseHeader("location").getValue(), 1);
                else
                    log.error("redirected url is null");
            } else {
                log.error("Unexpected failure: " + httppost.getStatusLine().toString());
            }
            httppost.releaseConnection();
        }
    }

    protected void doForwardFromPostRedirected(HttpServletRequest req, HttpServletResponse resp, String newUrl, int trynbr) throws ServletException, IOException {
        if (newUrl != null && trynbr < 10) {
            log.debug("Forwarding post: " + newUrl);

            PostMethod httppost = new PostMethod(newUrl);
            resp.setContentType("text/xml; charset=utf-8");
            // Transfer bytes from in to out
            String body = inputStreamAsString(req.getInputStream());

            HttpClient client = new HttpClient();
            Enumeration names = req.getParameterNames();
            while (names.hasMoreElements()) {
                String current = (String) names.nextElement();
                if (!current.equals("url")) {
                    if (log.isDebugEnabled())
                        log.debug("set parameter: " + current + " = " + req.getParameter(current));
                    httppost.setParameter(current, req.getParameter(current));
                }
            }

            if (0 == httppost.getParameters().length) {
                log.debug("No Name/Value pairs found ... pushing as raw_post_data");
                httppost.setParameter("raw_post_data", body);
            }
            if (log.isDebugEnabled()) {
                log.debug("Body = " + body);
                NameValuePair[] nameValuePairs = httppost.getParameters();
                log.debug("NameValuePairs found: " + nameValuePairs.length);
                for (int i = 0; i < nameValuePairs.length; ++i) {
                    log.debug("parameters:" + nameValuePairs[i].toString());
                }
            }
            // httppost.setRequestContentLength(PostMethod.CONTENT_LENGTH_CHUNKED);
            httppost.setFollowRedirects(true);
            client.executeMethod(httppost);
            if (log.isDebugEnabled()) {
                Header[] respHeaders = httppost.getResponseHeaders();
                for (int i = 0; i < respHeaders.length; ++i) {
                    String headerName = respHeaders[i].getName();
                    String headerValue = respHeaders[i].getValue();
                    log.debug("responseHeaders:" + headerName + "=" + headerValue);
                }
            }

            if (httppost.getStatusCode() == HttpStatus.SC_OK) {
                resp.setContentType("text/xml; charset=utf-8");
                IOUtils.copy(httppost.getResponseBodyAsStream(), resp.getOutputStream());
            } else if (httppost.getStatusCode() == HttpStatus.SC_MOVED_TEMPORARILY) {
                if (httppost.getResponseHeader("location") != null)
                    doForwardFromPostRedirected(req, resp, httppost.getResponseHeader("location").getValue(), trynbr + 1);
                else
                    log.error("redirected url is null");
            } else {
                log.error("Unexpected failure: " + httppost.getStatusLine().toString());
            }
            httppost.releaseConnection();
        }
    }

    /**
     * Get the specified parameter value from the query string.
     *
     * @param parameter   Parameter to retrieve.
     * @param queryString Query string to analyse.
     * @return The retrieved parameter value.
     */
    private String getParameter(String parameter, String queryString) {
        String result = null;
        if (queryString != null) {
            String[] exploded = queryString.split("&");
            for (String couple : exploded) {
                String[] coupleAsArray = couple.split("=");
                if (coupleAsArray.length > 1) {
                    if (coupleAsArray[0].toLowerCase().equals(parameter)) {
                        result = coupleAsArray[1];
                        break;
                    }
                }
            }
        }
        return result;
    }

    public static String inputStreamAsString(InputStream stream) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(stream, StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder();
        String line = null;

        while ((line = br.readLine()) != null) {
            sb.append(line + "\n");
        }

        br.close();
        return sb.toString();
    }
}
