
package fr.brgm.mapClient.vocabulary.sparql;

import lombok.Data;
import lombok.ToString;

import javax.xml.bind.annotation.*;


/**
 * <p>Classe Java pour anonymous complex type.
 *
 * <p>Le fragment de schéma suivant indique le contenu attendu figurant dans cette classe.
 *
 * <pre>
 * &lt;complexType>
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element ref="{http://www.w3.org/2007/SPARQL/results#}head"/>
 *         &lt;choice>
 *           &lt;element ref="{http://www.w3.org/2007/SPARQL/results#}results"/>
 *           &lt;element ref="{http://www.w3.org/2007/SPARQL/results#}boolean"/>
 *         &lt;/choice>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
        "results",
})
@XmlRootElement(name = "sparql")
@ToString
@Data
public class Sparql {

    @XmlElement
    protected Results results;


    /**
     * Obtient la valeur de la propriété results.
     *
     * @return possible object is
     * {@link Results }
     */
    public Results getResults() {
        return results;
    }

    /**
     * Définit la valeur de la propriété results.
     *
     * @param value allowed object is
     *              {@link Results }
     */
    public void setResults(Results value) {
        this.results = value;
    }
}
