package fr.brgm.mapClient.vocabulary.parser;


import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.HashMap;

public class ConceptList {

    private ArrayList<String> keys; //Clés de la list, de manière à conserver l'ordre de lecture
    private HashMap<String, Concept> listConcept;
    private String JSONConceptTree = "";
    ArrayList<String> listRootNode;

    private int idCpt = 0;

    public ConceptList() {
        keys = new ArrayList<String>();
        listConcept = new HashMap<String, Concept>();
        listRootNode = new ArrayList<String>();
    }

    public HashMap<String, Concept> createListConcept(ArrayList<Concept> list, String lang) {
        try {
            for (Concept c : list) {
                listConcept.put(c.getRdfAbout(), c);
                keys.add(c.getRdfAbout());
            }

            createConceptTree(lang);

            return listConcept;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


    public void getRootNode() {
        try {
            for (String key : keys) {
                Concept c = (Concept) listConcept.get(key);
                if (c.getBroader() == null) {
                    listRootNode.add(c.getRdfAbout());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();

        }
    }


    public void createConceptTree(String lang) {
        try {
            this.getRootNode();
            // Opening (0) : [
            JSONConceptTree += "[\n";
            for (int j = 0; j < listRootNode.size(); j++) {
                Concept c = (Concept) listConcept.get(listRootNode.get(j));
                // Opening (1) : {[
                idCpt++;
                JSONConceptTree += "{ \"text\": \"" + c.getPrefLabelByLang(lang) + "\", \"id\":\"" + idCpt + "\", \"uri\":\"" + c.getRdfAbout() + "\", \"cls\":\"folder\",";

                JSONConceptTree += " \"synonyms\":";
                String JSONCTSyn = "";
                for (String syn : c.getExactMatches()) {
                    if (JSONCTSyn.length() == 0)
                        JSONCTSyn = "[";
                    else
                        JSONCTSyn += ",";
                    JSONCTSyn += "\"" + syn + "\"";
                }
                if (JSONCTSyn.length() > 0)
                    JSONCTSyn += "]";
                else
                    JSONCTSyn = "\"null\"";
                JSONConceptTree += JSONCTSyn;
                JSONConceptTree += ",";

                JSONConceptTree += " \"children\":[\n";

                for (int i = 0; i < c.getListFils().size(); i++) {
                    Concept cFils = (Concept) listConcept.get(c.getListFils().get(i));
                    // Opening (2) : {
                    idCpt++;
                    JSONConceptTree += "{ \"text\":\"" + cFils.getPrefLabelByLang(lang) + "\", \"id\":\"" + idCpt + "\", \"uri\":\"" + c.getListFils().get(i) + "\",";

                    JSONConceptTree += " \"synonyms\":";
                    String JSONCTSynC = "";
                    for (String syn : cFils.getExactMatches()) {
                        if (JSONCTSynC.length() == 0)
                            JSONCTSynC = "[";
                        else
                            JSONCTSynC += ",";
                        JSONCTSynC += "\"" + syn + "\"";
                    }
                    if (JSONCTSynC.length() > 0)
                        JSONCTSynC += "]";
                    else
                        JSONCTSynC = "null";
                    JSONConceptTree += JSONCTSynC;
                    JSONConceptTree += ",";

                    if (cFils.getListFils().size() > 0) {
                        // Opening (3) : [
                        JSONConceptTree += "\"leaf\": false, \"checked\": false, \"children\":[\n";
                        getChildren(cFils, lang);
                        // Ending (3) : ]
                        JSONConceptTree += "]\n";
                    } else {
                        JSONConceptTree += "\"leaf\": true, \"checked\": false";
                    }

                    // Ending (2) : }
                    JSONConceptTree += "},";

                }

                // Removing the last ,
                JSONConceptTree = StringUtils.substring(JSONConceptTree, 0, JSONConceptTree.length() - 1);

                // Ending (1) : ]}
                JSONConceptTree += "]},";

            }

            // Removing the last ,
            JSONConceptTree = StringUtils.substring(JSONConceptTree, 0, JSONConceptTree.length() - 1);

            // Ending (0) : ]
            JSONConceptTree += "\n]";
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    public void getChildren(Concept c, String lang) {
        try {
            for (int i = 0; i < c.getListFils().size(); i++) {
                Concept cFils = (Concept) listConcept.get(c.getListFils().get(i));
                // Opening (1) : {
                try {
                    idCpt++;
                    JSONConceptTree += "{\"text\":\"" + cFils.getPrefLabelByLang(lang).replace("'", "\\'") + "\", \"id\":\"" + idCpt + "\", \"uri\":\"" + c.getListFils().get(i).replace("'", "\\'") + "\",";
                } catch (Exception e) {
                    System.err.println(cFils.getRdfAbout() + "> " + cFils.getPrefLabelByLang(lang));
                }

                JSONConceptTree += " \"synonyms\":";
                String JSONCTSynC = "";
                for (String syn : cFils.getExactMatches()) {
                    if (JSONCTSynC.length() == 0)
                        JSONCTSynC = "[";
                    else
                        JSONCTSynC += ",";
                    JSONCTSynC += "\"" + syn.replace("'", "\\'") + "\"";
                }
                if (JSONCTSynC.length() > 0)
                    JSONCTSynC += "]";
                else
                    JSONCTSynC = "\"null\"";
                JSONConceptTree += JSONCTSynC;
                JSONConceptTree += ",";

                if (cFils.getListFils().size() > 0) {
                    // Opening (2) : [
                    JSONConceptTree += "\"leaf\": false, \"checked\": false, \"children\":[\n";
                    getChildren(cFils, lang);
                    // Ending (2) : ]
                    JSONConceptTree += "]\n";
                } else {
                    JSONConceptTree += "\"leaf\": true, \"checked\": false";
                }

                // Ending (1);
                JSONConceptTree += "},";

            }

            // Removing the last ,
            JSONConceptTree = StringUtils.substring(JSONConceptTree, 0, JSONConceptTree.length() - 1);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public ArrayList<String> getListRootNode() {
        return listRootNode;
    }

    public String getJSON() {
        return this.JSONConceptTree;
    }

}
