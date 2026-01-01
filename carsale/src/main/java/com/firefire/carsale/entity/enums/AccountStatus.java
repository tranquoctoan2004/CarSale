package com.firefire.carsale.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum AccountStatus {
    active,
    inactive,
    banned;

    @JsonCreator
    public static AccountStatus from(String value) {
        if (value == null) {
            return null;
        }

        return switch (value.trim().toLowerCase()) {
            case "active" -> active;
            case "inactive" -> inactive;
            case "banned" -> banned;
            default -> throw new IllegalArgumentException("Invalid AccountStatus: " + value);
        };
    }
}
