package fr.brgm.mapClient.utils.utilities;

import org.apache.commons.digester.Digester;
import org.apache.commons.digester.xmlrules.DigesterLoader;

import javax.naming.InitialContext;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.util.Hashtable;

public class ParametersList {
    private static String urlRegistry = null;
    private static Hashtable<String, String> list;

    static {
        load();
    }

    public ParametersList() {
        list = new Hashtable<String, String>();
    }

    public synchronized static void load() {
        try {
            InitialContext ic = new InitialContext();
            urlRegistry = (String) ic.lookup("java:comp/env/param.url1GGParameters");
            URLConnection conn = new URL(urlRegistry).openConnection();
            InputStream in = conn.getInputStream();
            Digester digester = DigesterLoader.createDigester(ParametersList.class.getResource("parametersList.xml"));
            digester.setValidating(false);
            digester.parse(in);
            in.close();
        } catch (Exception e) {
            e.printStackTrace();
            urlRegistry = "";
            return;
        }
    }
}
