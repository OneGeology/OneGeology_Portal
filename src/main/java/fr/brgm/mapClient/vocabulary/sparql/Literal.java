
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
 *       &lt;attribute name="datatype" type="{http://www.w3.org/2007/SPARQL/results#}URI-reference" />
 *       &lt;attribute ref="{http://www.w3.org/XML/1998/namespace}lang"/>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
        "content"
})
@XmlRootElement(name = "literal")
@Data
@ToString
public class Literal {

    @XmlValue
    protected String content;
    @XmlAttribute(name = "datatype")
    protected String datatype;
    @XmlAttribute(name = "lang", namespace = "http://www.w3.org/XML/1998/namespace")
    protected String lang;

    /**
     * Obtient la valeur de la propriété content.
     *
     * @return possible object is
     * {@link String }
     */
    public String getContent() {
        return content;
    }

    /**
     * Définit la valeur de la propriété content.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setContent(String value) {
        this.content = value;
    }

    /**
     * Obtient la valeur de la propriété datatype.
     *
     * @return possible object is
     * {@link String }
     */
    public String getDatatype() {
        return datatype;
    }

    /**
     * Définit la valeur de la propriété datatype.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setDatatype(String value) {
        this.datatype = value;
    }

    /**
     * Obtient la valeur de la propriété lang.
     *
     * @return possible object is
     * {@link String }
     */
    public String getLang() {
        return lang;
    }

    /**
     * Définit la valeur de la propriété lang.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setLang(String value) {
        this.lang = value;
    }
}
