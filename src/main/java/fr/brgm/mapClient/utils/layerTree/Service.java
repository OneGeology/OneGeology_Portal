package fr.brgm.mapClient.utils.layerTree;

import java.util.ArrayList;

public class Service implements FeuilleNode {

	private String title;
	private String onlineResource;
	private final ArrayList<Layer> layerList;
	
	public Service(Layer l){
		this.title=l.getServerTitle();
		this.onlineResource=l.getOnlineResource();	
		layerList=new ArrayList<Layer>();
		layerList.add(l);
	}
	
	public int compareTo(Object arg0) {		
		return ((Service)arg0).getOnlineResource().compareTo(onlineResource);
	}

		public String getTitle() {
			return title;
		}

		public void setTitle(String title) {
			this.title = title;
		}

		public String getOnlineResource() {
			return onlineResource;
		}

		public void setOnlineResource(String onlineResource) {
			this.onlineResource = onlineResource;
		}

		public ArrayList<Layer> getLayerList() {
			return layerList;
		}
}
