package com.firefire.carsale.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum NewsStatus {
    draft,
    published,
    archived;

    @JsonCreator
    public static NewsStatus from(String value) {
        if (value == null)
            return null;
        String normalizedValue = value.trim().toLowerCase();
        return switch (normalizedValue) {
            case "draft" -> draft;
            case "published" -> published;
            case "archived" -> archived;
            default -> draft; // Mặc định là draft nếu sai
        };
    }
}