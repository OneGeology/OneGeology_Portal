package fr.brgm.mapClient.vocabulary.parser;

import org.apache.commons.digester.Digester;
import org.apache.commons.digester.xmlrules.DigesterLoader;

import java.util.HashMap;
import java.util.Map;

public class Correspondances {

    public static final Map<String, String> Vocab = load();

    @SuppressWarnings("unchecked")
    public static HashMap<String, String> load() {
        try {
            Digester digester = DigesterLoader.createDigester(Correspondances.class.getResource("mappingCorrespondances.xml"));
            digester.setValidating(false);
            HashMap<String, String> v = (HashMap<String, String>) digester.parse(Correspondances.class.getResourceAsStream("correspondances.xml"));
            return v;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}
