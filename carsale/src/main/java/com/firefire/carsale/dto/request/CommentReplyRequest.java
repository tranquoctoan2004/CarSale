package com.firefire.carsale.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentReplyRequest {
    private String content; // Nội dung phản hồi của Admin
}