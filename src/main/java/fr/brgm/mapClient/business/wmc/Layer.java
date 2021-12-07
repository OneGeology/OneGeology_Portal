package fr.brgm.mapClient.business.wmc;

import fr.brgm.mapClient.business.ows.Format;

@SuppressWarnings("unchecked")
public class Layer extends fr.brgm.mapClient.business.ows.Layer implements Comparable {
    private int id;
    private String catalogId;
    private boolean legend;
    private boolean transparent;
    private String service;
    private int order;
    private boolean baseLayer;
    private int categorie;
    private long scalemin;
    private long scalemax;

    public Layer(int id, String catalogId, boolean hidden, boolean queryable, boolean transparent, String service, String version, String onlineResource, String name, String title, int order, String opacity, String format, boolean baseLayer, int categorie, boolean legend, long scalemin, long scalemax) {
        this.id = id;
        this.catalogId = catalogId;
        this.setHidden(hidden);
        this.setQueryable(queryable);
        this.transparent = transparent;
        this.service = service;
        this.setVersion(version);
        this.setOnlineResource(onlineResource);
        this.setName(name);
        this.setTitle(title);
        this.order = order;
        this.setOpacity(opacity);
        Format f = new Format();
        f.setName(format);
        this.addFormat(f);
        this.baseLayer = baseLayer;
        this.categorie = categorie;
        this.legend = legend;
        this.scalemin = scalemin;
        this.scalemax = scalemax;
    }

    public Layer(boolean hidden, boolean queryable, boolean transparent, String service, String version, String onlineResource, String name, String title, int order, String opacity, String format, String catalog_id, boolean baseLayer, boolean legend, long scalemin, long scalemax) {
        this.setHidden(hidden);
        this.setQueryable(queryable);
        this.transparent = transparent;
        this.service = service;
        this.setVersion(version);
        this.setOnlineResource(onlineResource);
        this.setName(name);
        this.setTitle(title);
        this.order = order;
        this.setOpacity(opacity);
        Format f = new Format();
        f.setName(format);
        this.addFormat(f);
        this.catalogId = catalog_id;
        this.baseLayer = baseLayer;
        this.legend = legend;
        this.scalemin = scalemin;
        this.scalemax = scalemax;
    }

    public Layer(int id, boolean hidden, boolean queryable, boolean transparent, String service, String version, String onlineResource, String name, String title, int order, String opacity, String format, boolean baseLayer, int categorie) {
        this.id = id;
        this.setHidden(hidden);
        this.setQueryable(queryable);
        this.transparent = transparent;
        this.service = service;
        this.setVersion(version);
        this.setOnlineResource(onlineResource);
        this.setName(name);
        this.setTitle(title);
        this.order = order;
        this.setOpacity(opacity);
        Format f = new Format();
        f.setName(format);
        this.addFormat(f);
        this.baseLayer = baseLayer;
        this.categorie = categorie;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCatalogId() {
        return catalogId;
    }

    public void setCatalogId(String catalogId) {
        this.catalogId = catalogId;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public int getOrder() {
        return order;
    }

    public void setOrder(int order) {
        this.order = order;
    }

    public void up() {
        this.setOrder(this.getOrder() - 1);
    }

    public void down() {
        this.setOrder(this.getOrder() + 1);
    }

    public boolean isBaseLayer() {
        return baseLayer;
    }

    public void setBaseLayer(boolean baseLayer) {
        this.baseLayer = baseLayer;
    }

    public int getCategorie() {
        return categorie;
    }

    public void setCategorie(int categorie) {
        this.categorie = categorie;
    }

    public boolean isTransparent() {
        return transparent;
    }

    public void setTransparent(boolean transparent) {
        this.transparent = transparent;
    }

    public boolean hasLegend() {
        return legend;
    }

    public void setLegend(boolean legend) {
        this.legend = legend;
    }

    public long getScalemax() {
        return scalemax;
    }

    public void setScalemax(long scalemax) {
        this.scalemax = scalemax;
    }

    public long getScalemin() {
        return scalemin;
    }

    public void setScalemin(long scalemin) {
        this.scalemin = scalemin;
    }

    public int compareTo(Object arg0) {
        Layer l2 = (Layer) arg0;

        int result = this.getTitle().compareTo(l2.getTitle());

        return result;
    }
}