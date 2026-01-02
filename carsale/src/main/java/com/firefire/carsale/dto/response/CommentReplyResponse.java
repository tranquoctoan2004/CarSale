package com.firefire.carsale.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class CommentReplyResponse {
    private Integer replyId;
    private String username;
    private String content;
    private LocalDateTime createdAt;
}