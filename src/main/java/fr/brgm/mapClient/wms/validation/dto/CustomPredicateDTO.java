package fr.brgm.mapClient.wms.validation.dto;

import lombok.Data;

import java.util.function.Predicate;

@Data
public class CustomPredicateDTO<T> {
    private Predicate<T> predicate;
    private String errorMessage;
}
