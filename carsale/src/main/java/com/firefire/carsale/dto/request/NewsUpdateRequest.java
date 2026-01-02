package com.firefire.carsale.dto.request;

import com.firefire.carsale.entity.enums.NewsStatus;

import lombok.Data;

@Data
public class NewsUpdateRequest {
    private String title;
    private String content;
    private NewsStatus status; // draft, published, archived
    private String imageUrl;
}