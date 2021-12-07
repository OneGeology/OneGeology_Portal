package fr.brgm.mapClient.utils.layerTree;

import java.util.ArrayList;
import java.util.HashMap;

public class Layer extends fr.brgm.mapClient.business.ows.Layer implements FeuilleNode {

    private String accessConstraints;
    private String area;
    private String owner;
    private String provider;
    private String continent = "", subcontinent = "";
    private String areaState = "";
    private String thematic = "";
    private String extent;
    private String wfsGeom, wfsURL, wfsSrs, wfsURLType;
    private boolean isAvailable = true;
    private boolean OLBaseLayer;
    private boolean autoLayer = false;
    private boolean gcQueryable = false;
    private String serviceType;
    private boolean OLDisplayInLayerSwitcher;
    private String simulatedID = "0";
    private String simulatedPosition = "0";
    private boolean keepInLayerSwitcher = true;
    private String country;

    private String minScaleDenominator;
    private String maxScaleDenominator;
    private final HashMap<String, String> keywordList;
    private final ArrayList<String> thematicKeywords;
    private final ArrayList<LayerKeywords> tmpKeywords;
    private final ArrayList<LayerTransferOptions> tmpTransferOptions;
    private final ArrayList<LayerTransferOptions> tmpOperatesOn;

    private String sLat;
    private String nLat;
    private String legendURL;

    private String type;


    public Layer() {
        tmpTransferOptions = new ArrayList<LayerTransferOptions>();
        tmpOperatesOn = new ArrayList<LayerTransferOptions>();
        keywordList = new HashMap<String, String>();
        thematicKeywords = new ArrayList<String>();
        tmpKeywords = new ArrayList<LayerKeywords>();
    }

    public String getJSon() {
        String description = "";
        if (this.getDescription() != null)
            description = this.getDescription().replaceAll("\\r|\\n", " ");
        String layerJSON = "{" +
                "id : \"" + this.getUuid() + "\", " +
                "name: \"" + this.getName() + "\", " +
                "title: \"" + this.getTitle() + "\", " +
                "description: \"" + description + "\", " +
                "queryable: \"" + this.isQueryable() + "\", " +
                "visibility: \"" + !this.isHidden() + "\", " +
                "serverUrl: \"" + this.getOnlineResource() + "\", " +
                "serverTitle: \"" + this.getServerTitle() + "\", " +
                "version: \"" + this.getVersion() + "\", " +
                "owner: \"" + this.getOwner() + "\", " +
                "provider: \"" + this.getProvider() + "\", " +
                "extent: \"" + this.getExtent() + "\", " +
                "accessConstraints: \"" + this.getAccessConstraints() + "\", " +
                "dataURL: \"" + this.getDataURL() + "\", " +
                "metadataURL: \"" + this.getMetadataURL() + "\", " +
                "legendURL: \"" + (this.getCurrentStyle() == null ? "" : this.getCurrentStyle().getLegendURL()) + "\", " +
                "opacity: \"" + this.getOpacity() + "\", " +
                "gcqueryable: \"" + this.isGcQueryable() + "\", " +
                "isOLBaseLayer: \"" + this.isOLBaseLayer() + "\"," +
                "wfsURL: \"" + this.getWfsURL() + "\"," +
                "wfsURLType: \"" + this.getWfsURLType() + "\"," +
                "wfsGeom: \"" + this.getWfsGeom() + "\"," +
                "wfsSrs: \"" + this.getWfsSrs() + "\"," +
                "minScaleDenominator: \"" + this.getMinScaleDenominator() + "\"," +
                "maxScaleDenominator: \"" + this.getMaxScaleDenominator() + "\"," +
                "country: \"" + this.getCountry() + "\"," +
                "simulatedID: \"" + this.getSimulatedID() + "\"," +
                "simulatedPosition : \"" + this.getSimulatedPosition() + "\"," +
                "styles : \"" + (this.getCurrentStyle() == null ? "" : this.getCurrentStyle().getName()) + "\", " +
                "keepInLayerSwitcher: \"" + this.getKeepInLayerSwitcher() + "\"," +
                "displayInLayerSwitcher: \"" + this.isOLDisplayInLayerSwitcher() + "\"" +
                "}";

        return layerJSON;
    }

    public String getAccessConstraints() {
        return accessConstraints;
    }

    public void setAccessConstraints(String accessConstraints) {
        if (accessConstraints != null)
            this.accessConstraints = accessConstraints.replace("\n", " ");
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getContinent() {
        return continent;
    }

    public void setContinent(String continent) {
        this.continent = continent;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getByName(String cri) {
        if ("owner".equals(cri)) {
            if (getOwner() != null)
                return getOwner();
            else return "Owner not defined";
        }
        if ("provider".equals(cri)) {
            if (getProvider() != null)
                return getProvider();
            else return "Provider not defined";
        }


        if ("area".equals(cri)) return getArea();
        if ("continent".equals(cri)) return getContinent();
        if ("subcontinent".equals(cri)) return getSubcontinent();
        if ("state".equals(cri)) return getAreaState();
        if ("thematic".equals(cri)) {
            if (getThematic() != null)
                return getThematic();
            else return "Thematic not defined";
        }
        return "";
    }

    /**
     * @param oLBaseLayer the oLisBaseLayer to set
     */
    public void setOLBaseLayer(boolean oLBaseLayer) {
        OLBaseLayer = oLBaseLayer;
    }

    /**
     * @return the oLisBaseLayer
     */
    public boolean isOLBaseLayer() {
        return OLBaseLayer;
    }

    public void setOLDisplayInLayerSwitcher(boolean oLDisplayInLS) {
        OLDisplayInLayerSwitcher = oLDisplayInLS;
    }

    public boolean isOLDisplayInLayerSwitcher() {
        return OLDisplayInLayerSwitcher;
    }

    public int compareTo(Object l) {
        return this.getTitle().compareTo(((Layer) l).getTitle());
    }

    public String getAreaState() {
        return areaState;
    }

    public void setAreaState(String areaState) {
        this.areaState = areaState;
    }

    public String getExtent() {
        return extent;
    }

    public void setExtent(String extent) {
        this.extent = extent;
    }

    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean isAvailable) {
        this.isAvailable = isAvailable;
    }

    public String toString() {
        return this.getTitle() + " [" + this.getOnlineResource() + "]";
    }

    public String toStringArea() {
        return this.getSubcontinent() + " " + this.getArea() + " ";
    }

    public String getWfsGeom() {
        return wfsGeom;
    }

    public void setWfsGeom(String wfsGeom) {
        this.wfsGeom = wfsGeom;
    }

    public String getWfsSrs() {
        return wfsSrs;
    }

    public void setWfsSrs(String wfsSrs) {
        this.wfsSrs = wfsSrs;
    }

    public String getWfsURL() {
        return wfsURL;
    }

    public void setWfsURL(String wfsURL) {
        this.wfsURL = wfsURL;
    }

    public String getWfsURLType() {
        return wfsURLType;
    }

    public void setWfsURLType(String wfsURLType) {
        this.wfsURLType = wfsURLType;
    }

    public String getSubcontinent() {
        return subcontinent;
    }

    public void setSubcontinent(String subcontinent) {
        this.subcontinent = subcontinent;
    }

    public String getThematic() {
        return thematic;
    }

    public void setThematic(String thematic) {
        this.thematic = thematic;
    }

    public boolean isGcQueryable() {
        return gcQueryable;
    }

    public void setAutoLayer(boolean autoLayer) {
        this.autoLayer = autoLayer;
    }

    public boolean isAutoLayer() {
        return this.autoLayer;
    }


    public void setMinScaleDenominator(String minScale) {
        this.minScaleDenominator = minScale;
    }

    public String getMinScaleDenominator() {
        return minScaleDenominator;
    }

    public void setMaxScaleDenominator(String maxScale) {
        this.maxScaleDenominator = maxScale;
    }

    public String getMaxScaleDenominator() {
        return maxScaleDenominator;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setSimulatedID(String simuID) {
        this.simulatedID = simuID;
    }

    public String getSimulatedID() {
        return simulatedID;
    }

    public void setSimulatedPosition(String simuPos) {
        this.simulatedPosition = simuPos;
    }

    public String getSimulatedPosition() {
        return simulatedPosition;
    }

    public void setKeepInLayerSwitcher(boolean keepInLayerSwitcher) {
        this.keepInLayerSwitcher = keepInLayerSwitcher;
    }

    public boolean getKeepInLayerSwitcher() {
        return keepInLayerSwitcher;
    }


    public void setSLat(String sLat) {
        this.sLat = sLat;
    }

    public String getSLat() {
        return sLat;
    }

    public void setNLat(String nLat) {
        this.nLat = nLat;
    }

    public String getNLat() {
        return nLat;
    }

    public String getLegendURL() {
        return legendURL;
    }

    public void setLegendURL(String legendURL) {
        this.legendURL = legendURL;
    }

    public String getServiceType() {
        return this.serviceType;
    }

    public void setServiceType(String servType) {
        this.serviceType = servType;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getCountry() {
        return country;
    }

    public ArrayList<LayerTransferOptions> getTransferOptions() {
        return this.tmpTransferOptions;
    }

    public ArrayList<String> getThematicKeywordsList() {
        return this.thematicKeywords;
    }
}
