package fr.brgm.mapClient.sld.dao;

import lombok.Data;

@Data
public class SldFileDAO {

    private String fileName;
    private byte[] bytes;
}
