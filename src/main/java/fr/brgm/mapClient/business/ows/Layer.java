package fr.brgm.mapClient.business.ows;

import org.apache.commons.lang.StringUtils;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Layer {
	
	private String uuid;
	private String underlyingUuid;
	private boolean hidden;
	private boolean queryable;
	private String serverTitle;
	private String serverVersion;
	private String version;
	private String onlineResource;
	private String name;
	private String title;
	private String description;
	private String dataURL;
	private String metadataURL;
	private String opacity;
	private Set<Format> formats;
	private Set<Style> styles;
	private Enveloppe LatLonBoundingBox;
	private List<String> srs;
	private String minScaleDenominator;
	private String maxScaleDenominator;
	private String extensions;
	private String legendURL;
	private Set<LayerDimension> dimensions;

	public String getUuid() {
		return uuid;
	}
	public void setUuid(String uuid) {
		this.uuid = uuid;
	}
	public String getUnderlyingUuid() {
		return underlyingUuid;
	}
	public void setUnderlyingUuid(String underlyingUuid) {
		this.underlyingUuid = underlyingUuid;
	}
	public boolean isHidden() {
		return hidden;
	}
	public void setHidden(boolean hidden) {
		this.hidden = hidden;
	}
	public boolean isQueryable() {
		return queryable;
	}
	public void setQueryable(boolean queryable) {
		this.queryable = queryable;
	}
	public String getServerTitle() {
		return serverTitle;
	}
	public void setServerTitle(String serverTitle) {
		this.serverTitle = serverTitle;
	}
	/**
	 * @param version the version to set
	 */
	public void setVersion(String version) {
		this.version = version;
	}
	/**
	 * @return the version
	 */
	public String getVersion() {
		if (StringUtils.isNotEmpty(version)) {
			return version;
		} else {
			//dirty fix to be sure to return something or export kml does not work
			return "1.1.1";
		}
	}
	public String getOnlineResource() {
		return onlineResource;
	}
	public void setOnlineResource(String onlineResource) {
		this.onlineResource = onlineResource;
	}
	public String getName() {
		return name;
	}
	/**
	 * @return the name with the uuid
	 */
	public String getNameOnly() {
		return name.split("&")[0];
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getDataURL() {
		return dataURL;
	}
	public void setDataURL(String dataURL) {
		this.dataURL = dataURL;
	}
	public String getMetadataURL() {
		return metadataURL;
	}
	public void setMetadataURL(String metadataURL) {
		this.metadataURL = metadataURL;
	}
	public String getOpacity() {
		return opacity;
	}
	public void setOpacity(String opacity) {
		this.opacity = opacity;
	}
	/**
	 * @return the formats
	 */
	public Set<Format> getFormats() {
		return formats;
	}

	/**
	 * @param formats the formats to set
	 */
	public void setFormats(Set<Format> formats) { 
		this.formats = formats;
	}

	/**
	 * Add the specified format to the layer
	 * 
	 * @param format
	 */
	public void addFormat(Format format) { 
		if (formats == null) {
			formats = new HashSet<Format>();
		}
		formats.add(format);
	}
	/**
	 * Renvoie le format courant (s'il y en a plusieurs, seul le premier est renvoy�)
	 * @return Format courant
	 */
	public Format getCurrentFormat() { 
		Format currentFormat = null;
		if (formats!=null) {
			for (Format format : formats) {
				if (format.isCurrent()) {
					currentFormat = format;
					break;
				}
			}
		}
		return currentFormat;
	}

	/**
	 * @return the styles
	 */
	public Set<Style> getStyles() { 
		return styles;
	}

	/**
	 * @param styles the styles to set
	 */
	public void setStyles(Set<Style> styles) { 
		this.styles = styles;
	}
	
	/**
	 * Add the specified style to the layer
	 * 
	 * @param style
	 */
	public void addStyle(Style style)  { 
		if (styles == null) {
			styles = new HashSet<Style>();
			style.setCurrent(true);
		}
		styles.add(style);
	}
	
	public NamedStyle getCurrentStyle() {
		NamedStyle currentStyle = null;
		if (styles!=null) {
			for (Style style : styles) {
				if (style.isCurrent()) {
					if(style.getClass().getName().endsWith("NamedStyle"))
						currentStyle = (NamedStyle)style;
					break;
				}
			}
		}
		return currentStyle;
	}	
	
	/**
	 * @param latLonBoundingBox the latLonBoundingBox to set
	 */
	public void setLatLonBoundingBox(Enveloppe latLonBoundingBox) {
		LatLonBoundingBox = latLonBoundingBox;
	}
	/**
	 * @return the latLonBoundingBox
	 */
	public Enveloppe getLatLonBoundingBox() {
		return LatLonBoundingBox;
	}
	
	/**
	 * @return the srs
	 */
	public List<String> getSrs() {
		return srs;
	}

	/**
	 * @param srs the srs to set
	 */
	public void setSrs(List<String> srs) {
		this.srs = srs;
	}

	/**
	 * Add the specified srs to the layer
	 * 
	 * @param srs
	 */
	public void addSrs(String srs) {
		if (this.srs == null) {
			this.srs = new ArrayList<String>();
		}
		this.srs.add(srs);
	}
	/**
	 * @return the maxScaleDenominator
	 */
	public String getMaxScaleDenominator() {
		return maxScaleDenominator;
	}

	/**
	 * @param maxScaleDenominator the maxScaleDenominator to set
	 */
	public void setMaxScaleDenominator(String maxScaleDenominator) {
		this.maxScaleDenominator = maxScaleDenominator;
	}

	/**
	 * @return the minScaleDenominator
	 */
	public String getMinScaleDenominator() {
		return minScaleDenominator;
	}

	/**
	 * @param minScaleDenominator the minScaleDenominator to set
	 */
	public void setMinScaleDenominator(String minScaleDenominator) {
		this.minScaleDenominator = minScaleDenominator;
	}
	
	/**
	 * @return the extensions
	 */
	public String getExtensions() {
		return extensions;
	}

	/**
	 * @param extensions the extensions to set
	 */
	public void setExtensions(String extensions) {
		this.extensions = extensions;
	}
	public Set<LayerDimension> getDimensions() { 
        return dimensions;
	}
	
	public void setDimensions(Set<LayerDimension> dimensions) { 
	        this.dimensions = dimensions;
	}

	public String getLegendURL() {
		return legendURL;
	}

	public void setLegendURL(String legendURL) {
		this.legendURL = legendURL;
	}
}
