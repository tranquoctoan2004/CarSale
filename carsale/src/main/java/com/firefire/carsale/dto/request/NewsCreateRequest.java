package com.firefire.carsale.dto.request;

import lombok.Data;
import com.firefire.carsale.entity.enums.NewsStatus;

@Data
public class NewsCreateRequest {
    private String title;
    private String content;
    private String imageUrl;
    private NewsStatus status;
}
