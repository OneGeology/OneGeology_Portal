
package fr.brgm.mapClient.vocabulary.sparql;

import lombok.Data;
import lombok.ToString;

import javax.xml.bind.annotation.*;
import javax.xml.bind.annotation.adapters.CollapsedStringAdapter;
import javax.xml.bind.annotation.adapters.XmlJavaTypeAdapter;


/**
 * <p>Classe Java pour anonymous complex type.
 *
 * <p>Le fragment de schéma suivant indique le contenu attendu figurant dans cette classe.
 *
 * <pre>
 * &lt;complexType>
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;choice>
 *         &lt;element ref="{http://www.w3.org/2007/SPARQL/results#}uri"/>
 *         &lt;element ref="{http://www.w3.org/2007/SPARQL/results#}bnode"/>
 *         &lt;element ref="{http://www.w3.org/2007/SPARQL/results#}literal"/>
 *       &lt;/choice>
 *       &lt;attGroup ref="{http://www.w3.org/2007/SPARQL/results#}nameAttr"/>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
        "uri",
        "literal"
})
@XmlRootElement(name = "binding")
@ToString
@Data
public class Binding {

    @XmlElement
    protected String uri;
    @XmlElement
    protected Literal literal;
    @XmlAttribute(name = "name", required = true)
    @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
    @XmlSchemaType(name = "NMTOKEN")
    protected String name;

    /**
     * Obtient la valeur de la propriété uri.
     *
     * @return possible object is
     * {@link String }
     */
    public String getUri() {
        return uri;
    }

    /**
     * Définit la valeur de la propriété uri.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setUri(String value) {
        this.uri = value;
    }


    /**
     * Obtient la valeur de la propriété literal.
     *
     * @return possible object is
     * {@link Literal }
     */
    public Literal getLiteral() {
        return literal;
    }

    /**
     * Définit la valeur de la propriété literal.
     *
     * @param value allowed object is
     *              {@link Literal }
     */
    public void setLiteral(Literal value) {
        this.literal = value;
    }

    /**
     * Obtient la valeur de la propriété name.
     *
     * @return possible object is
     * {@link String }
     */
    public String getName() {
        return name;
    }

    /**
     * Définit la valeur de la propriété name.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setName(String value) {
        this.name = value;
    }
}
