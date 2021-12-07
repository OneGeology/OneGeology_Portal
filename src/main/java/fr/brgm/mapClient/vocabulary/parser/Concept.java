package fr.brgm.mapClient.vocabulary.parser;

import lombok.Data;
import lombok.ToString;

import java.util.ArrayList;
import java.util.HashMap;

@ToString
@Data
public class Concept {
	
	private String rdfAbout;
	private HashMap<String, String> prefLabel = new HashMap<String,String>();
	private HashMap<String, String> listConcept = new HashMap<String, String>();
	private String broader;
	private HashMap<String, String> notation = new HashMap<String, String>();
	private HashMap<String, String> definition = new HashMap<String, String>();
	private HashMap<String, String> ageFrom = new HashMap<String, String>();
	private HashMap<String, String> ageTo = new HashMap<String, String>();
	private HashMap<String, String> historyNote = new HashMap<String, String>();
	private HashMap<String, String> seeAlso = new HashMap<String, String>();
	private ArrayList<String> listRelated = new ArrayList<String>();
	private HashMap<String, String> altLabel = new HashMap<String,String>();
	
	// Addition FT@2014/04/14 - support mapping CGI/INSPIRE
	private ArrayList<String> exactMatches = new ArrayList<String>();
	
	private ArrayList<String> listFils;
	private boolean isRoot=true;
	
	private ArrayList<Concept> fils;
	
	public Concept(){
		listFils = new ArrayList<String>();
		fils = new ArrayList<Concept>();
	}
	
	/**
	 * @param exactMatch the exactMatch to add
	 */
	public void addExactMatch(String exactMatch) {
		this.exactMatches.add(exactMatch);
	}
	
	/**
	 * @return return the exactMatches for this Concept
	 */
	public ArrayList<String> getExactMatches(){
		return this.exactMatches;
	}
	
	/**
	 * @param externalExactMatches the exactMatches to merge to the internal ones
	 */
	public void mergeExactMatches(ArrayList<String> externalExactMatches) {
		for( String exactMatch : externalExactMatches ) {
			if( ! this.exactMatches.contains(exactMatch) )
				this.exactMatches.add(exactMatch);
		}
	}
	
	/**
	 * @param externalExactMatches the exactMatches that will be used to replace the internal ones
	 */
	public void setExactMatches(ArrayList<String> externalExactMatches) {
		this.exactMatches = externalExactMatches;
	}
	
	/**
	 * @param rdfAbout the rdfAbout to set
	 */
	public void setRdfAbout(String rdfAbout) {
		this.rdfAbout = rdfAbout;
	}
	/**
	 * @return the rdfAbout
	 */
	public String getRdfAbout() {
		return rdfAbout;
	}
	/**
	 * @param prefLabel the prefLabel to set
	 */
	public void setPrefLabel(HashMap<String, String> prefLabel) {
		this.prefLabel = prefLabel;
	}
	/**
	 * @return the prefLabel
	 */
	public HashMap<String, String> getPrefLabel() {
		return prefLabel;
	}
	
	public void addPrefLabel(String language,String languagedPrefLabel){
		prefLabel.put(language, languagedPrefLabel);
	}
	public String getPrefLabelByLang(String language){
		if( prefLabel.containsKey(language) )
			return prefLabel.get(language);
		else
			return prefLabel.get("en");
	}
	
	public String getBroader(){
		return this.broader;
	}
	public void setBroader(String broader){
		if(broader!=null){
			//this.broader = broader.split(":")[6];
			this.broader = broader;
		}else{
			this.broader="";
		}
	}
	
	public void addConcept(String rdfAbout, String broader){
		listConcept.put(rdfAbout, broader);
	}
	
	public HashMap<String, String> getListConcept(){
		return this.listConcept;
	}
	
	public void addFils(String narrower){
		listFils.add(narrower);
	}
	public ArrayList<String> getListFils(){
		return this.listFils;
	}
	
	public boolean haschildren(){
		if(getListFils().size()>0) return true;
		else return false;
	}
	
	
	public boolean isRoot() {
		return isRoot;
	}
	public void setRoot(boolean isRoot) {
		this.isRoot = isRoot;
	}
	
	public void addFils2(Concept c){
		fils.add(c);		
	}	
	
	public ArrayList<Concept> getFils() {
		return fils;
	}
	
	public HashMap<String, String> getNotation() {
		return this.notation;
	}
	public void setNotation(HashMap<String, String> notation) {
		this.notation = notation;
	}
	public void addNotation(String language,String languagedNotation){
		notation.put(language, languagedNotation);
	}
	public String getNotationByLang(String language){
		if( notation.containsKey(language) )
			return notation.get(language);
		else
			return notation.get("en");
	}
	
	public HashMap<String, String> getDefinition() {
		return this.definition;
	}
	public void setDefinition(HashMap<String, String> definition) {
		this.definition = definition;
	}
	public void addDefinition(String language,String languagedDefinition){
		definition.put(language, languagedDefinition);
	}
	public String getDefinitionByLang(String language){
		if( definition.containsKey(language) )
			return definition.get(language);
		else
			return definition.get("en");
	}
	
	public void addAgeFrom(String language,String languagedAgeFrom){
		ageFrom.put(language, languagedAgeFrom);
	}
	public String getAgeFromByLang(String language){
		if( ageFrom.containsKey(language) )
			return ageFrom.get(language);
		else
			return ageFrom.get("en");
	}
	
	public void addAgeTo(String language,String languagedAgeTo){
		ageTo.put(language, languagedAgeTo);
	}
	public String getAgeToByLang(String language){
		if( ageTo.containsKey(language) )
			return ageTo.get(language);
		else
			return ageTo.get("en");
	}
	
	public void addHistoryNote(String language,String languagedHistoryNote){
		historyNote.put(language, languagedHistoryNote);
	}
	public String getHistoryNoteLang(String language){
		if( historyNote.containsKey(language) )
			return historyNote.get(language);
		else
			return historyNote.get("en");
	}
	
	public void addSeeAlso(String language, String languagedSeeAlso){
		seeAlso.put(language, languagedSeeAlso);
	}
	public String getSeeAlsoByLang(String language){
		if(seeAlso.containsKey(language))
			return seeAlso.get(language);
		else
			return seeAlso.get("en");
	}
	
	public void addRelated(String related){
		listRelated.add(related);
	}
		
	public ArrayList<String> getRelatedTerms(){
		return listRelated;
	}
	
	public void addAltLabel(String language,String languagedAltLabel){
		if(!altLabel.containsKey(language)){
			altLabel.put(language, languagedAltLabel);
		}else{
			altLabel.put(language, altLabel.get(language).concat(", "+languagedAltLabel));			
		}
		//altLabel.put(language, languagedAltLabel);
	}
	public String getAltLabelByLang(String language){
		if( altLabel.containsKey(language) )
			return altLabel.get(language);
		else
			return altLabel.get("en");
	}
}
