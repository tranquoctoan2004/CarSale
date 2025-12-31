package com.firefire.carsale.dto.request;

import lombok.Data;

@Data
public class CommentCreateRequest {
    private Integer orderDetailId;
    private Integer rating;
    private String content;
}
