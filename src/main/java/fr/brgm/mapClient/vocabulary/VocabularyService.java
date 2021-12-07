package fr.brgm.mapClient.vocabulary;

import fr.brgm.mapClient.config.properties.ApplicationProperties;
import fr.brgm.mapClient.vocabulary.parser.Concept;
import fr.brgm.mapClient.vocabulary.parser.ConceptList;
import fr.brgm.mapClient.vocabulary.parser.XMLParser;
import lombok.AllArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@AllArgsConstructor
public class VocabularyService {

    ApplicationProperties properties;

    public String getVocabularyContent(String vocaName) {
        String lang_value = "en";

        ApplicationProperties.Vocabulary vocabulary = this.getVocabulary(vocaName);

        if (vocabulary == null) return "[]";

        ArrayList<Concept> c;
        if (StringUtils.isNoneBlank(vocabulary.getUrl())) {
            c = XMLParser.loadGlobalVocabularyWithMapping(vocabulary.getUrl(), vocabulary.getMappingUrl());
        } else {
            c = XMLParser.requestErmlVocab(vocaName);
        }

        ConceptList cl = new ConceptList();
        cl.createListConcept(c, lang_value);
        String JSon = cl.getJSON();
        return JSon;
    }

    private ApplicationProperties.Vocabulary getVocabulary(String name) {
        ApplicationProperties.Vocabulary result = null;
        ApplicationProperties.Vocabulary defaultVocab = null;
        for (ApplicationProperties.Vocabulary vocab : properties.getVocabularies()) {
            if (vocab.getName().equals(name)) {
                result = vocab;
            }
            if (vocab.getIsDefault() && defaultVocab == null) {
                defaultVocab = vocab;
            }
        }

        return (result != null) ? result : defaultVocab;
    }
}
