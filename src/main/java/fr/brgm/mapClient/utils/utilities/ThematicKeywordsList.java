package fr.brgm.mapClient.utils.utilities;

import org.apache.commons.digester.Digester;
import org.apache.commons.digester.xmlrules.DigesterLoader;

import javax.naming.InitialContext;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Map;

public class ThematicKeywordsList {

    private static ArrayList<ThematicKeyword> list;
    private static String url1GGThematicKeywords = null;

    static {
        load();
    }

    public ThematicKeywordsList() {
        list = new ArrayList<ThematicKeyword>();
    }

    public void addThematicKeyword(ThematicKeyword tkw) {
        list.add(tkw);
    }

    public synchronized static LinkedHashMap<String, ThematicKeyword> load() {
        ThematicKeywordsList list = null;
        LinkedHashMap<String, ThematicKeyword> Hlist = new LinkedHashMap<String, ThematicKeyword>();
        try {
            InitialContext ic = new InitialContext();
            url1GGThematicKeywords = (String) ic.lookup("java:comp/env/param.url1GGThematicKeywords");
            URLConnection conn = new URL(url1GGThematicKeywords).openConnection();
            InputStream in = conn.getInputStream();
            Digester digester = DigesterLoader.createDigester(ParametersList.class.getResource("thematicKeywordsList.xml"));
            digester.setValidating(false);
            list = (ThematicKeywordsList) digester.parse(in);
            in.close();
            for (ThematicKeyword tk : list.getListThematicKeyword()) {
                Hlist.put(tk.getTerm().toLowerCase(), tk);
            }
            for (Map.Entry<String, ThematicKeyword> entry : Hlist.entrySet()) {
                ThematicKeyword tkw = entry.getValue();
            }

            return Hlist;
        } catch (Exception e) {
            url1GGThematicKeywords = "";
            return null;
        }
    }

    public ArrayList<ThematicKeyword> getListThematicKeyword() {
        return list;
    }
}
