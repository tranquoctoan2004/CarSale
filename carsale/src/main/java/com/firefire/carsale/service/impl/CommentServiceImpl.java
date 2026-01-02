package com.firefire.carsale.service.impl;

import com.firefire.carsale.dto.request.CommentCreateRequest;
import com.firefire.carsale.dto.response.CommentResponse;
import com.firefire.carsale.entity.Account;
import com.firefire.carsale.entity.Comment;
import com.firefire.carsale.entity.enums.VisibilityStatus;
import com.firefire.carsale.repository.AccountRepository;
import com.firefire.carsale.repository.CommentRepository;
import com.firefire.carsale.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final AccountRepository accountRepository;

    @Override
    @Transactional(readOnly = true) // Giữ session mở trong suốt hàm này
    public List<CommentResponse> getAllVisibleComments() {
        // GỌI HÀM CÓ JOIN FETCH Ở REPOSITORY
        List<Comment> comments = commentRepository.findAllVisibleWithAccount(VisibilityStatus.visible);

        return comments.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponse> searchByUsername(String username) {
        return commentRepository.searchByUsernameWithAccount(username)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CommentResponse createComment(CommentCreateRequest request, Integer accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        Comment comment = new Comment();
        comment.setAccount(account);
        comment.setContent(request.getContent());
        comment.setRating(request.getRating());
        comment.setReviewDate(LocalDateTime.now());
        comment.setStatus(VisibilityStatus.visible);

        Comment saved = commentRepository.save(comment);
        return mapToResponse(saved);
    }

    // Hàm này cực kỳ quan trọng, phải lấy dữ liệu từ c.getAccount() ngay tại đây
    private CommentResponse mapToResponse(Comment c) {
        return CommentResponse.builder()
                .commentId(c.getCommentId())
                .accountId(c.getAccount().getAccountId())
                .username(c.getAccount().getUsername())
                .fullName(c.getAccount().getFullName())
                .content(c.getContent())
                .rating(c.getRating())
                .reviewDate(c.getReviewDate().toString())
                .build();
    }

    @Override
    public CommentResponse updateComment(Integer id, CommentCreateRequest request, Integer accountId) {
        return null;
    }

    @Override
    public void deleteComment(Integer id, Integer accountId) {
    }
}