package fr.brgm.mapClient.business.wmc;

import fr.brgm.mapClient.business.ows.Enveloppe;
import lombok.Data;

import java.util.ArrayList;

@Data
public class Context {
    private Enveloppe bbox;
    public ArrayList<Layer> layers;

    public Context() {
        this.layers = new ArrayList<>();
    }
}
