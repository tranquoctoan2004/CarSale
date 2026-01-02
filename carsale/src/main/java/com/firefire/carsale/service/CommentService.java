package com.firefire.carsale.service;

import com.firefire.carsale.dto.request.CommentCreateRequest;
import com.firefire.carsale.dto.response.CommentResponse;
import java.util.List;

public interface CommentService {
    List<CommentResponse> getAllVisibleComments();

    List<CommentResponse> searchByUsername(String username);

    CommentResponse createComment(CommentCreateRequest request, Integer accountId);

    CommentResponse updateComment(Integer id, CommentCreateRequest request, Integer accountId);

    void deleteComment(Integer id, Integer accountId);
}