package com.firefire.carsale.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class NewsResponse {
    private Integer newsId;
    private String title;
    private String content;
    private String imageUrl;
    private String status;
    private String authorName;
    private LocalDateTime date;
}