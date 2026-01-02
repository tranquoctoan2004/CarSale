package com.firefire.carsale.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentResponse {
    private Integer commentId;
    private Integer accountId; // Quan trọng để check quyền Sửa/Xóa
    private String username;
    private String fullName;
    private String content;
    private Integer rating;
    private String reviewDate;
    private Integer carId; // Trả về ID xe nếu có liên kết qua orderDetail
}
