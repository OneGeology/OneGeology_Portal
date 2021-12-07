package fr.brgm.mapClient.utils.utilities;

public class ThematicKeyword {

    protected int category;
    protected String term;
    protected String definition;
    protected int nbOccurence = 0;

    public ThematicKeyword() {
    }

    public int getCategory() {
        return category;
    }

    public void setCategory(int category) {
        this.category = category;
    }

    public String getTerm() {
        return term;
    }

    public void setTerm(String term) {
        this.term = term;
    }

    public String getDefinition() {
        return definition;
    }

    public void setDefinition(String definition) {
        this.definition = definition;
    }

    public int getNbOccurence() {
        return nbOccurence;
    }

    public void setNbOccurence(int nbOccurence) {
        this.nbOccurence = nbOccurence;
    }
}
