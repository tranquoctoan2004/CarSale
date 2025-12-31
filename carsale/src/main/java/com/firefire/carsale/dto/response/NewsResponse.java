package com.firefire.carsale.dto.response;

import lombok.Data;
import java.time.LocalDateTime;
import com.firefire.carsale.entity.enums.NewsStatus;

@Data
public class NewsResponse {
    private Integer newsId;
    private String title;
    private String imageUrl;
    private String authorName;
    private LocalDateTime date;
    private NewsStatus status;
}
