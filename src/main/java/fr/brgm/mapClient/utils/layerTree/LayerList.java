package fr.brgm.mapClient.utils.layerTree;

import fr.brgm.mapClient.business.ows.Enveloppe;

import java.util.ArrayList;
import java.util.Collections;

public class LayerList {

    ArrayList<Layer> list;
    ArrayList<Layer> listService;
    private Node listRemap;

    private Enveloppe bbox;


    public LayerList() {
        list = new ArrayList<Layer>();
    }

    public void addLayer(Layer rec) {
        list.add(rec);
    }

    public void sort(Node node) {
        Collections.sort(node.getLayerList());
        Collections.sort(node.getNodeList());

        for (Node n : node.getNodeList()) {
            sort(n);
        }
    }

    public ArrayList<Layer> getList() {
        return list;
    }

    public ArrayList<Layer> getListService() {
        return listService;
    }

    public Node getListRemap() {
        return listRemap;
    }

    public void setListRemap(Node listRemap) {
        this.listRemap = listRemap;
    }

    public void setBbox(Enveloppe bbox) {
        this.bbox = bbox;
    }

    public Enveloppe getBbox() {
        return bbox;
    }
}
