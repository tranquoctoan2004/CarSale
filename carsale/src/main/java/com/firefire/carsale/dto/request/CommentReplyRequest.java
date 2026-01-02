package com.firefire.carsale.dto.request;

import lombok.Data;

@Data
public class CommentReplyRequest {
    private Integer commentId;
    private String content;
}