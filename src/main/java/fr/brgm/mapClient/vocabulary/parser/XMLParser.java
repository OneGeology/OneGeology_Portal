package fr.brgm.mapClient.vocabulary.parser;


import fr.brgm.mapClient.vocabulary.sparql.Binding;
import fr.brgm.mapClient.vocabulary.sparql.Result;
import fr.brgm.mapClient.vocabulary.sparql.Sparql;
import org.apache.commons.digester.Digester;
import org.apache.commons.digester.xmlrules.DigesterLoader;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import java.io.InputStream;
import java.io.StringReader;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;


public class XMLParser {

    @SuppressWarnings("unchecked")
    public static ArrayList<Concept> load(String pathFile, String nameMappingFile) {
        try {
            URLConnection conn = new URL(pathFile).openConnection();
            InputStream in = conn.getInputStream();
            Digester digester = DigesterLoader.createDigester(XMLParser.class.getResource(nameMappingFile));
            digester.setValidating(false);
            ArrayList<Concept> list = (ArrayList<Concept>) digester.parse(in);
            in.close();

            return list;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public static ArrayList<Concept> loadGlobalVocabularyWithMapping(String vocabularyURL, String mappingURL) {
        ArrayList<Concept> voca = load(vocabularyURL, "mappingVocabularies.xml");
        // Load the mapping
        ArrayList<Concept> mapping = load(mappingURL, "mappingVocabularies.xml");
        // Put the mapping in a Map (easiest to search inside)
        HashMap<String, Concept> mappingHM = new HashMap<String, Concept>();
        if (mapping != null && !mapping.isEmpty()) {
            for (Concept concept : mapping) {
                mappingHM.put(concept.getRdfAbout(), concept);
            }
        }
        // Do here the match between the vocabulary and the mapping
        if (voca != null && !voca.isEmpty()) {
            for (Concept concept : voca) {
                if (mappingHM.containsKey(concept.getRdfAbout())) // WARNING : in this case we just remove the exactMatches coming from the original vocabulary, if this is not what you want : use mergeExactMatches instead of setExactMatches
                    concept.setExactMatches(((Concept) mappingHM.get(concept.getRdfAbout())).getExactMatches());
            }
        }
        return voca;
    }

    public static ArrayList<Concept> requestErmlVocab(String vocabularyName) {
        ArrayList<Concept> conceptList = new ArrayList<>();
        try {
            String sparqlRequest = "select distinct ?id ?label ?parent ?parentName where{?id a <http://www.w3.org/2004/02/skos/core#Concept>. ?id <http://www.w3.org/2004/02/skos/core#prefLabel> ?label . optional{?id <http://www.w3.org/2004/02/skos/core#broader> ?parent. ?parent <http://www.w3.org/2004/02/skos/core#prefLabel> ?parentName}}";
            sparqlRequest = URLEncoder.encode(sparqlRequest, StandardCharsets.UTF_8.toString());
            String url = "http://vocabs.ands.org.au/repository/api/sparql/" + vocabularyName + "?query=" + sparqlRequest;

            CloseableHttpClient httpClient = HttpClients.createSystem();
            HttpGet request = new HttpGet(url);
            try (CloseableHttpResponse response = httpClient.execute(request)) {
                HttpEntity entity = response.getEntity();
                if (entity != null) {
                    String result = EntityUtils.toString(entity);
                    result = result.replaceAll(" xmlns='http://www.w3.org/2005/sparql-results#'", "");
                    JAXBContext jaxbContext;
                    try {
                        jaxbContext = JAXBContext.newInstance(Sparql.class);
                        Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
                        StringReader reader = new StringReader(result);
                        Sparql sparqlResult = (Sparql) jaxbUnmarshaller.unmarshal(reader);

                        HashMap<String, ArrayList<String>> haspMapFils = new HashMap<>();
                        for (Result result1 : sparqlResult.getResults().getResult()) {
                            Concept concept = sparqlResultToConcept(haspMapFils, result1);
                            conceptList.add(concept);
                        }
                        for (Concept c : conceptList) {
                            if (haspMapFils.get(c.getRdfAbout()) != null) {
                                c.setListFils(haspMapFils.get(c.getRdfAbout()));
                            }
                        }
                    } catch (JAXBException e) {
                        e.printStackTrace();
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return conceptList;
    }

    private static Concept sparqlResultToConcept(HashMap<String, ArrayList<String>> haspMapFils, Result result1) {
        Concept concept = new Concept();
        for (Binding binding : result1.getBinding()) {
            if ("id".equalsIgnoreCase(binding.getName()) && StringUtils.isNotEmpty(binding.getUri())) {
                concept.setRdfAbout(binding.getUri());
            }
            if ("label".equalsIgnoreCase(binding.getName()) && StringUtils.isNotEmpty(binding.getLiteral().getContent())) {
                HashMap<String, String> map = new HashMap<>();
                String nameCapitalized = binding.getLiteral().getContent().substring(0, 1).toUpperCase() + binding.getLiteral().getContent().substring(1);
                map.put("en", nameCapitalized);
                concept.setPrefLabel(map);
            }
            if ("parent".equalsIgnoreCase(binding.getName()) && StringUtils.isNotEmpty(binding.getUri())) {
                concept.setBroader(binding.getUri());
            }
        }

        if (StringUtils.isNotEmpty(concept.getBroader())) {
            if (haspMapFils.get(concept.getBroader()) == null) {
                ArrayList<String> listFils = new ArrayList<>();
                listFils.add(concept.getRdfAbout());
                haspMapFils.put(concept.getBroader(), listFils);
            } else {
                haspMapFils.get(concept.getBroader()).add(concept.getRdfAbout());
            }
        }
        return concept;
    }
}
