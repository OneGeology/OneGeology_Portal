package fr.brgm.mapClient.proxy;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.file.*;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@WebServlet(urlPatterns = "/proxycatalog",loadOnStartup = 1)
public class ProxyCatalog extends HttpServlet {

    private final static Log log = LogFactory.getLog(ProxyCatalog.class);

    /**
     * List of valid content types
     */
    public static final String[] _validContentTypes =
            {
                    "application/xml", "text/xml",
            };

    public static final String _defaultConstraintToSend =
            "<csw:GetRecords xmlns:csw=\"http://www.opengis.net/cat/csw/2.0.2\" service=\"CSW\" version=\"2.0.2\" resultType=\"results\" maxRecords=\"1000\" startPosition=\"1\">"
            + "<csw:Query typeNames=\"csw:Record\">"
            + "<csw:ElementSetName>full</csw:ElementSetName>"
            + "<csw:Constraint version=\"1.1.0\">"
            + "<Filter xmlns=\"http://www.opengis.net/ogc\" xmlns:gml=\"http://www.opengis.net/gml\">"
                + "<PropertyIsEqualTo>"
                    + "<PropertyName>dc:type</PropertyName>"
                    + "<Literal>dataset</Literal>"
                + "</PropertyIsEqualTo>"
            + "</Filter>"
            + "</csw:Constraint>"
            + "</csw:Query>"
            + "</csw:GetRecords>";

    /**
     * Current servlet context
     */
    public ServletContext context_ = null;

    /**
     * the path object to the catalog cache file
     */
    private volatile Path cacheFilePath = null;

    /**
     * boolean to indicate if there is a pending update of the catalog cache
     */
    private volatile boolean cacheUpdatePending = false;

    /***************************************************************************
     * Initialize variables called when context is initialized
     *
     */
    @SuppressWarnings("unchecked")
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        context_ = config.getServletContext();
        //if(StringUtils.isNotEmpty(config.getInitParameter("allowedHosts"))){
        //allowedHosts = new StrTokenizer(config.getInitParameter("allowedHosts"),",").getTokenList();
        //}
        log.info("mapbuilder.ProxyCatalog: context initialized to:" + context_.getServletContextName());
        try {
            this.initializeCatalogCache();
        } catch (IOException e) {
            log.error("An error happen when trying to initialize catalog cache");
            throw new RuntimeException(e);
        }
    }

    /***************************************************************************
     * Process the HTTP Post request
     */
    @SuppressWarnings({"deprecation", "rawtypes"})
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException {
        String url = request.getParameter("url");
        log.debug(String.format(" Redirect Post to %s", url));
        handleRequest(request, response, url);
    } // doPost

    private void handleRequest(HttpServletRequest request, HttpServletResponse response, String sURL) {
        InputStream streamFromServer = null;
        ByteArrayOutputStream streamToCache = null;
        boolean useCatalogCache = Boolean.valueOf(request.getHeader("use-catalog-cache"));
        try {
            if (useCatalogCache && Files.exists(this.cacheFilePath)) {
                OutputStream streamToClient = response.getOutputStream();
                if(getCatalogCacheContent(streamToClient, sURL)) {
                    return;
                }
            }

            if (sURL.startsWith("http://") || sURL.startsWith("https://")) {
                URL url = null;
                try {
                    url = new URL(sURL);
                } catch (MalformedURLException e) { // not an url
                    response.sendError(HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
                    return;
                }

                String requestMethod = request.getMethod();

                // open communication between proxy and final host
                // all actions before the connection can be taken now
                HttpURLConnection connectionWithFinalHost = (HttpURLConnection) url.openConnection();

                // set request method
                connectionWithFinalHost.setRequestMethod(requestMethod);
                connectionWithFinalHost.setDoOutput(true);

                // copy headers from client's request to request that will be send to the final host
                copyHeadersToConnection(request, connectionWithFinalHost);
                connectionWithFinalHost.setRequestProperty("Accept-Encoding", "");

                // connect to remote host
                // interactions with the resource are enabled now
                connectionWithFinalHost.connect();

                ServletInputStream in = request.getInputStream();
                OutputStream out = connectionWithFinalHost.getOutputStream();
                byte[] buf = new byte[1024]; // read maximum 1024 bytes
                int len;                     // number of bytes read from the stream
                while ((len = in.read(buf)) > 0) {
                    out.write(buf, 0, len);
                }

                // get content type
                String contentType = connectionWithFinalHost.getContentType();
                if (contentType == null) {
                    response.sendError(HttpServletResponse.SC_FORBIDDEN,
                            "Host url has been validated by proxy but content type given by remote host is null");
                    return;
                }

                // content type has to be valid
                if (!isContentTypeValid(contentType)) {

                    if (connectionWithFinalHost.getResponseMessage() != null) {
                        if (connectionWithFinalHost.getResponseMessage().equalsIgnoreCase("Not Found")) {
                            // content type was not valid because it was a not found page (text/html)
                            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Remote host not found");
                            return;
                        }
                    }

                    response.sendError(HttpServletResponse.SC_FORBIDDEN,
                            "The content type of the remote host's response \"" + contentType
                                    + "\" is not allowed by the proxy rules");
                    return;
                }

                // send remote host's response to client

                /* Here comes the tricky part because some host send files without the charset
                 * in the header, therefore we do not know how they are text encoded. It can result
                 * in serious issues on IE browsers when parsing those files.
                 * There is a workaround which consists to read the encoding within the file. It is made
                 * possible because this proxy mainly forwards xml files. They all have the encoding
                 * attribute in the first xml node.
                 *
                 * This is implemented as follows:
                 *
                 * A. The content type provides a charset:
                 *     Nothing special, just send back the stream to the client
                 * B. There is no charset provided:
                 *     The encoding has to be extracted from the file.
                 *     The file is read in ASCII, which is common to many charsets,
                 *     like that the encoding located in the first not can be retrieved.
                 *     Once the charset is found, the content-type header is overridden and the
                 *     charset is appended.
                 *
                 *     /!\ Special case: whenever data are compressed in gzip/deflate the stream has to
                 *     be uncompressed and compressed
                 */

                boolean isCharsetKnown = connectionWithFinalHost.getContentType().toLowerCase().contains("charset");
                String contentEncoding = getContentEncoding(connectionWithFinalHost.getHeaderFields());

                // copy headers from the remote server's response to the response to send to the client
                if (isCharsetKnown) {
                    copyHeadersFromConnectionToResponse(response, connectionWithFinalHost);
                } else {
                    // copy everything except Content-Type header
                    // because we need to concatenate the charset later
                    copyHeadersFromConnectionToResponse(response, connectionWithFinalHost, "Content-Type");
                }

                OutputStream streamToClient = null;

                if (contentEncoding == null || isCharsetKnown) {
                    // A simple stream can do the job for data that is not in content encoded
                    // but also for data content encoded with a known charset
                    streamFromServer = connectionWithFinalHost.getInputStream();
                    streamToClient = response.getOutputStream();
                    if (useCatalogCache) {
                        streamToCache = new ByteArrayOutputStream();
                    }
                } else {
                    throw new UnsupportedOperationException("Please handle the stream when it is encoded in " + contentEncoding);
                }

                buf = new byte[1024]; // read maximum 1024 bytes
                len = 0;                     // number of bytes read from the stream
                boolean first = true;        // helps to find the encoding once and only once
                String s = "";
                boolean clientIsOnline = true; // helps to know if we can write response to the client
                while ((len = streamFromServer.read(buf)) > 0) {

                    if (first && !isCharsetKnown) {
                        // charset is unknown try to find it in the file content
                        for (int i = 0; i < len; i++) {
                            s += (char) buf[i]; // get the beginning of the file as ASCII
                        }

                        // s has to be long enough to contain the encoding
                        if (s.length() > 200) {
                            String charset = getCharset(s); // extract charset

                            if (charset == null) {
                                // the charset cannot be found, IE users must be warned
                                // that the request cannot be fulfilled, nothing good would happen otherwise
                                if (request.getHeader("User-Agent").toLowerCase().contains("msie")) {
                                    response.sendError(HttpServletResponse.SC_NOT_ACCEPTABLE,
                                            "Charset of the response is unknown");
                                    streamFromServer.close();
                                    connectionWithFinalHost.disconnect();
                                    streamToClient.close();
                                    if (useCatalogCache && !cacheUpdatePending) {
                                        streamToCache.close();
                                    }
                                    return;
                                }
                            } else {
                                // override content-type header and add the charset found
                                response.addHeader("Content-Type",
                                        connectionWithFinalHost.getContentType()
                                                + ";charset=" + charset);
                                first = false; // we found the encoding, don't try to do it again
                            }
                        }
                    }

                    // for everyone, the stream is just forwarded to the client
                    if (clientIsOnline) {
                        try {
                            streamToClient.write(buf, 0, len);
                        } catch (IOException e) {
                            clientIsOnline = false;
                        }
                    }

                    if (useCatalogCache && !cacheUpdatePending) {
                       streamToCache.write(buf, 0, len);
                    }
                }

                streamFromServer.close();
                connectionWithFinalHost.disconnect();
                if (clientIsOnline) {
                    streamToClient.close();
                }
                if (useCatalogCache && !cacheUpdatePending) {
                    putInCatalogCache(streamToCache, sURL);
                }

            } else {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST,
                        "HTTP protocol expected.");
                return;
            }
        } catch (IOException e) {
            // connection problem with the host
            e.printStackTrace();
        }
    }

    /**
     * Method for updating cache, don't use, it's internal for updating cache at the server start.
     *
     * @throws IOException
     */
    private void updateCatalogCache() throws IOException {
        BufferedReader reader = Files.newBufferedReader(this.cacheFilePath);
        String cUrl = reader.readLine().replace("\n","");
        reader.close();
        updateCatalogCache(cUrl);
    }

    /**
     * Do the request to the geonetwork server for updating the catalog cache, if all good then puts the response body in the cache file
     *
     * @param sUrl
     * @throws IOException
     */
    private void updateCatalogCache(String sUrl) throws IOException {
        if (sUrl.startsWith("http://") || sUrl.startsWith("https://")) {
            log.info("Updating Catalog Cache ...");
            URL url = null;
            try {
                url = new URL(sUrl);
            } catch (MalformedURLException e) { // not an url
                log.error("Error when updating catalog cache : "+e.getMessage());
                return;
            }

            // open communication between proxy and final host
            // all actions before the connection can be taken now
            HttpURLConnection connectionWithFinalHost = (HttpURLConnection) url.openConnection();

            // set request method
            connectionWithFinalHost.setRequestMethod("POST");
            connectionWithFinalHost.setDoOutput(true);

            connectionWithFinalHost.setRequestProperty("Accept-Encoding", "");
            connectionWithFinalHost.setRequestProperty("Content-type","application/xml");

            // connect to remote host
            // interactions with the resource are enabled now
            connectionWithFinalHost.connect();

            OutputStream out = connectionWithFinalHost.getOutputStream();
            byte[] buf = ProxyCatalog._defaultConstraintToSend.getBytes(); // read maximum 1024 bytes
            out.write(buf);

            // get content type
            String contentType = connectionWithFinalHost.getContentType();
            if (contentType == null) {
                log.error("Error when updating catalog cache : Host url has been validated by proxy but content type given by remote host is null");
                return;
            }

            // content type has to be valid
            if (!isContentTypeValid(contentType)) {

                if (connectionWithFinalHost.getResponseMessage() != null) {
                    if (connectionWithFinalHost.getResponseMessage().equalsIgnoreCase("Not Found")) {
                        // content type was not valid because it was a not found page (text/html)
                        log.error("Error when updating catalog cache : Remote host not found");
                        return;
                    }
                }

                log.error(
                        "Error when updating catalog cache : The content type of the remote host's response \"" + contentType
                                + "\" is not allowed by the proxy rules");
                return;
            }

            boolean isCharsetKnown = connectionWithFinalHost.getContentType().toLowerCase().contains("charset");
            String contentEncoding = getContentEncoding(connectionWithFinalHost.getHeaderFields());

            InputStream streamFromServer = null;
            ByteArrayOutputStream streamToCache = null;
            if (contentEncoding == null || isCharsetKnown) {
                // A simple stream can do the job for data that is not in content encoded
                // but also for data content encoded with a known charset
                streamFromServer = connectionWithFinalHost.getInputStream();
                streamToCache = new ByteArrayOutputStream();
            } else {
                throw new UnsupportedOperationException("Error when updating catalog cache : Please handle the stream when it is encoded in " + contentEncoding);
            }

            buf = new byte[1024]; // read maximum 1024 bytes
            int len = 0;                     // number of bytes read from the stream
            while ((len = streamFromServer.read(buf)) > 0) {

                // for everyone, the stream is just forwarded to the client
                streamToCache.write(buf, 0, len);
            }

            streamFromServer.close();
            connectionWithFinalHost.disconnect();
            putInCatalogCache(streamToCache, sUrl);

            log.info("Catalog cache updated successfully");
        } else {
            log.error("Error when updating catalog cache : HTTP protocol expected.");
            return;
        }
        return;
    }

    /**
     * Write to the client response the cached body of the catalog, if the cache is outdated then it'll update it in a background thread
     *
     * @param streamToClient stream to client response
     * @param sUrl the requested url
     * @return false if we cannot get cache for the requested url, else true
     * @throws IOException
     */
    private boolean getCatalogCacheContent(OutputStream streamToClient, String sUrl) throws IOException {
        BufferedReader cacheContent = Files.newBufferedReader(this.cacheFilePath);
        String cUrl = cacheContent.readLine().replace("\n","");
        if(!isSameUrlCatalogCache(cUrl, sUrl)) {
            return false;
        }
        byte[] buf = new byte[1024]; // read maximum 1024 bytes
        char[] cbuf = new char[1024]; // read maximum 1024 bytes
        int len;                     // number of bytes read from the stream
        while ((len = cacheContent.read(cbuf)) > 0) {
            for (int i = 0; i < 1024; i++) {
                buf[i] = (byte) cbuf[i];
            }
            streamToClient.write(buf,0, len);
        }
        cacheContent.close();
        streamToClient.close();
        if(isOutdatedCatalogCache() &&!cacheUpdatePending) {
            log.info("Catalog Cache outdated");
            Thread updateThread = new Thread(() -> {
                try {
                    updateCatalogCache(cUrl);
                    cacheUpdatePending = false;
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            });
            cacheUpdatePending = true;
            updateThread.start();
        }
        return true;
    }

    /**
     * Initialize the catalog cache, create cache directory in current working dir if not exists, and automatically update the existing cache if it's outdated
     *
     * @throws IOException
     */
    private void initializeCatalogCache() throws IOException {
        Path cacheDir = Paths.get("cache");
        if (Files.notExists(cacheDir)) {
            Files.createDirectory(cacheDir);
        }
        this.cacheFilePath = Paths.get("cache","cache.xml");
        if (Files.exists(this.cacheFilePath) && isOutdatedCatalogCache()) {
            log.info("Catalog Cache outdated");
            updateCatalogCache();
        }
    }

    /**
     * Put in the catalog cache the response stream, the 1st line of the cache file is the url to cache
     *
     * @param stream the response body to cache
     * @param sUrl the url to cache
     * @throws IOException
     */
    private void putInCatalogCache(ByteArrayOutputStream stream, String sUrl) throws IOException {
        if (Files.exists(this.cacheFilePath)) {
            Files.delete(this.cacheFilePath);
        }
        if (Files.notExists(this.cacheFilePath)) {
            Files.createFile(this.cacheFilePath);
        }
        OutputStream cacheContent = Files.newOutputStream(this.cacheFilePath, StandardOpenOption.APPEND);
        sUrl += "\n";
        cacheContent.write(sUrl.getBytes());
        stream.writeTo(cacheContent);
        stream.close();
        cacheContent.close();
    }

    /**
     * Check if the requested url is the cached one
     *
     * @param cachedUrl the cached url in the cache file (1st line of it)
     * @param requestedUrl the requested url
     * @return true if the cache has the same url that the one requested
     */
    private boolean isSameUrlCatalogCache(String cachedUrl, String requestedUrl) {
        return cachedUrl.equalsIgnoreCase(requestedUrl);
    }

    /**
     * Check if the cache file has more than 24 hours of life, if true then the cache is outdated
     *
     * @return true if the cache if outdated
     * @throws IOException
     */
    private boolean isOutdatedCatalogCache() throws IOException {
        return Files.getLastModifiedTime(this.cacheFilePath).toInstant().plus(24, ChronoUnit.HOURS).isBefore(Instant.now());
    }

    /**
     * Extract the encoding from a string which is the header node of an xml file
     *
     * @param header String that should contain the encoding attribute and its value
     * @return the charset. null if not found
     */
    private String getCharset(String header) {
        Pattern pattern = null;
        String charset = null;
        try {
            // use a regexp but we could also use string functions such as
            // indexOf...
            pattern = Pattern.compile("encoding=(['\"])([A-Za-z]([A-Za-z0-9._]|-)*)");
        } catch (Exception e) {
            throw new RuntimeException("expression syntax invalid");
        }

        Matcher matcher = pattern.matcher(header);
        if (matcher.find()) {
            String encoding = matcher.group();
            charset = encoding.split("['\"]")[1];
        }

        return charset;
    }

    /**
     * Gets the encoding of the content sent by the remote host: extracts the
     * content-encoding header
     *
     * @param headerFields headers of the HttpURLConnection
     * @return null if not exists otherwise name of the encoding (gzip, deflate...)
     */
    private String getContentEncoding(Map<String, List<String>> headerFields) {
        for (Iterator<String> i = headerFields.keySet().iterator(); i.hasNext(); ) {
            String headerName = i.next();
            if (headerName != null) {
                if ("Content-Encoding".equalsIgnoreCase(headerName)) {
                    List<String> valuesList = headerFields.get(headerName);
                    StringBuilder sBuilder = new StringBuilder();
                    for (String value : valuesList) {
                        sBuilder.append(value);
                    }

                    return sBuilder.toString().toLowerCase();
                }
            }
        }
        return null;
    }

    /**
     * Helper function to detect if a specific header is in a given ignore list
     *
     * @param headerName
     * @param ignoreList
     * @return true: in, false: not in
     */
    private boolean isInIgnoreList(String headerName, String[] ignoreList) {
        if (headerName == null) return false;

        for (String headerToIgnore : ignoreList) {
            if (headerName.equalsIgnoreCase(headerToIgnore))
                return true;
        }
        return false;
    }

    /**
     * Copy headers from the connection to the response
     *
     * @param response   to copy headers in
     * @param uc         contains headers to copy
     * @param ignoreList list of headers that mustn't be copied
     */
    private void copyHeadersFromConnectionToResponse(HttpServletResponse response, HttpURLConnection uc, String... ignoreList) {
        Map<String, List<String>> map = uc.getHeaderFields();
        for (Iterator<String> i = map.keySet().iterator(); i.hasNext(); ) {

            String headerName = i.next();

            if (!isInIgnoreList(headerName, ignoreList)) {

                // concatenate all values from the header
                List<String> valuesList = map.get(headerName);
                StringBuilder sBuilder = new StringBuilder();
                for (String value : valuesList) {
                    sBuilder.append(value);
                }

                // add header to HttpServletResponse object
                if (headerName != null) {
                    if ("Transfer-Encoding".equalsIgnoreCase(headerName) && "chunked".equalsIgnoreCase(sBuilder.toString())) {
                        // do not write this header because Tomcat already assembled the chunks itself
                        continue;
                    }
                    response.addHeader(headerName, sBuilder.toString());
                }
            }
        }
    }

    /**
     * Copy client's headers in the request to send to the final host
     * Trick the host by hiding the proxy indirection and keep useful headers information
     *
     * @param request
     * @param uc      Contains now headers from client request except Host and custom header for cache
     */
    protected void copyHeadersToConnection(HttpServletRequest request, HttpURLConnection uc) {

        for (Enumeration enumHeader = request.getHeaderNames(); enumHeader.hasMoreElements(); ) {
            String headerName = (String) enumHeader.nextElement();
            String headerValue = request.getHeader(headerName);

            // copy every header except host and use-catalog-cache
            if (!"host".equalsIgnoreCase(headerName) || !"use-catalog-cache".equalsIgnoreCase(headerName)) {
                uc.setRequestProperty(headerName, headerValue);
            }
        }
    }

    /**
     * Check if the content type is accepted by the proxy
     *
     * @param contentType
     * @return true: valid; false: not valid
     */
    protected boolean isContentTypeValid(final String contentType) {

        // focus only on type, not on the text encoding
        String type = contentType.split(";")[0];
        for (String validTypeContent : ProxyCatalog._validContentTypes) {
            if (validTypeContent.equals(type)) {
                return true;
            }
        }
        return false;
    }

}
