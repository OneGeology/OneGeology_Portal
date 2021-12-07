package fr.brgm.mapClient.business.ows;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Enveloppe {

    private double minX;
    private double maxX;
    private double minY;
    private double maxY;
    private String srs;
}
