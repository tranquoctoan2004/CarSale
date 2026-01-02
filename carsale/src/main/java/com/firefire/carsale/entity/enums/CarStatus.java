package com.firefire.carsale.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum CarStatus {
    available,
    sold,
    out_of_stock;

    @JsonCreator
    public static CarStatus from(String value) {
        if (value == null) {
            return null;
        }
        // Chuẩn hóa input từ Frontend (bất kể hoa thường) về chữ thường để khớp với
        // enum
        String normalizedValue = value.trim().toLowerCase().replace("-", "_");

        return switch (normalizedValue) {
            case "available" -> available;
            case "sold" -> sold;
            case "out_of_stock" -> out_of_stock;
            default -> throw new IllegalArgumentException("Invalid CarStatus: " + value);
        };
    }
}
