package com.firefire.carsale.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentReplyResponse {
    private Integer replyId;
    private String content;
    private String createdAt; // Định dạng lại từ LocalDateTime để hiển thị
    private String adminName; // Lấy từ Account entity trong CommentReply
    private String status;
}