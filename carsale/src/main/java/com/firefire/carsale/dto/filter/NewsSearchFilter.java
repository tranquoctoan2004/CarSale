package com.firefire.carsale.dto.filter;

import com.firefire.carsale.entity.enums.NewsStatus;

import lombok.Data;

@Data
public class NewsSearchFilter {
    private String title;
    private NewsStatus status;
}
