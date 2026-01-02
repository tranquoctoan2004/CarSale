package com.firefire.carsale.service;

import com.firefire.carsale.dto.filter.CommentSearchFilter;
import com.firefire.carsale.dto.request.CommentCreateRequest;
import com.firefire.carsale.dto.response.CommentResponse;
import java.util.List;

public interface CommentService {
    // --- USER METHODS ---
    List<CommentResponse> getAllVisibleComments();

    // Sửa lỗi số 1: Thêm phương thức tìm kiếm
    List<CommentResponse> searchByUsername(String username);

    CommentResponse createComment(CommentCreateRequest request, Integer accountId);

    CommentResponse updateComment(Integer id, CommentCreateRequest request, Integer accountId);

    void deleteComment(Integer id, Integer accountId);

    // --- ADMIN METHODS ---
    List<CommentResponse> adminGetAllComments(CommentSearchFilter filter, int page, int size);

    void adminDeleteComment(Integer id);

    // Sửa lỗi số 2 & 3: Thống nhất 3 tham số (id, content, adminId)
    void adminReplyComment(Integer id, String replyContent, Integer adminId);
}