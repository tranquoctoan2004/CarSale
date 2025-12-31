package com.firefire.carsale.dto.response;

import lombok.Data;
import java.time.LocalDateTime;
import com.firefire.carsale.entity.enums.VisibilityStatus;

@Data
public class CommentResponse {
    private Integer commentId;
    private Integer rating;
    private String content;
    private VisibilityStatus status;
    private LocalDateTime reviewDate;
    private String username;
}
