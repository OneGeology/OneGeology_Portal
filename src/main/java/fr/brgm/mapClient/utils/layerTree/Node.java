package fr.brgm.mapClient.utils.layerTree;

import java.util.ArrayList;


public class Node implements Comparable {
    private String name;
    private boolean isOpened = false;
    private ArrayList<Node> nodeList;
    private ArrayList<FeuilleNode> layerList;

    public Node(String n) {
        this.name = n;
        this.nodeList = new ArrayList<Node>();
        this.layerList = new ArrayList<FeuilleNode>();
    }

    public Node contains(String key) {
        for (Node n : nodeList)
            try {
                if (n.getName().toUpperCase().equals(key.toUpperCase())) {
                    return n;
                }
            } catch (Exception ex) {
                return null;
            }

        return null;
    }

    public Node getNodeType(Layer l, String type) {
        Node noeud = contains(l.getByName(type));
        //Ce continent existe deja ds la liste
        if (noeud == null) {
            noeud = new Node(l.getByName(type));
            addNode(noeud);
        }
        return noeud;
    }

    public Node getArea(Layer l) {
        return getNodeType(l, "area");
    }

    public Node getState(Layer l) {
        return getNodeType(l, "state");
    }


    public ArrayList<FeuilleNode> getLayerList() {
        return layerList;
    }

    public void setLayerList(ArrayList<FeuilleNode> layerList) {
        this.layerList = layerList;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ArrayList<Node> getNodeList() {
        return nodeList;
    }

    public void setNodeList(ArrayList<Node> nodeList) {
        this.nodeList = nodeList;
    }

    public void addNode(Node d) {
        this.nodeList.add(d);
    }


    public int compareTo(Object n) {
        try {
            return this.getName().compareTo(((Node) n).getName());
        } catch (Exception ex) {
            return 0; // The two are not equal, but we cannot compare them and if we throw an Exception the Collection.Sort crash after that...
        }
    }

    public boolean isOpened() {
        return isOpened;
    }

    public void setOpened(boolean isOpened) {
        this.isOpened = isOpened;
    }
}
