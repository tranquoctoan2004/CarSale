package com.firefire.carsale.dto.filter;

import lombok.Data;

@Data
public class CommentSearchFilter {
    private String username;
    private String content;
    private Integer rating;
    private String status; // ví dụ: "visible", "hidden"
}