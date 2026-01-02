package com.firefire.carsale.service.impl;

import com.firefire.carsale.dto.filter.CommentSearchFilter;
import com.firefire.carsale.dto.request.CommentCreateRequest;
import com.firefire.carsale.dto.response.CommentReplyResponse;
import com.firefire.carsale.dto.response.CommentResponse;
import com.firefire.carsale.entity.Account;
import com.firefire.carsale.entity.Comment;
import com.firefire.carsale.entity.CommentReply;
import com.firefire.carsale.entity.enums.VisibilityStatus;
import com.firefire.carsale.repository.AccountRepository;
import com.firefire.carsale.repository.CommentReplyRepository;
import com.firefire.carsale.repository.CommentRepository;
import com.firefire.carsale.service.CommentService;
import lombok.RequiredArgsConstructor;

// XÓA dòng import cũ nếu có: import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties.Sort;

// THÊM các dòng import chuẩn này:
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final CommentReplyRepository replyRepository;
    private final AccountRepository accountRepository;
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    // --- ADMIN LOGIC ---

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponse> adminGetAllComments(CommentSearchFilter filter, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("commentId").descending());

        // Tạm thời lấy tất cả theo phân trang, bạn có thể viết thêm Specification để
        // lọc theo Filter sau
        return commentRepository.findAll(pageable)
                .getContent()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void adminDeleteComment(Integer id) {
        // Xóa reply liên quan trước để tránh lỗi Foreign Key
        replyRepository.deleteByComment_CommentId(id);
        commentRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void adminReplyComment(Integer id, String replyContent, Integer adminId) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        Account admin = accountRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin account not found"));

        // Nếu đã có reply thì cập nhật nội dung, chưa có thì tạo mới
        CommentReply reply = replyRepository.findByComment_CommentId(id)
                .orElse(new CommentReply());

        reply.setComment(comment);
        reply.setAccount(admin);
        reply.setContent(replyContent);
        reply.setCreatedAt(LocalDateTime.now());
        reply.setStatus("visible");

        replyRepository.save(reply);
    }

    // --- USER LOGIC ---

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponse> getAllVisibleComments() {
        // Giả sử bạn dùng enum VisibilityStatus hoặc String "visible"
        return commentRepository.findAll().stream()
                .filter(c -> c.getStatus() != null && c.getStatus().toString().equalsIgnoreCase("visible"))
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponse> searchByUsername(String username) {
        // Đảm bảo CommentRepository đã có hàm searchByUsernameWithAccount
        return commentRepository.searchByUsernameWithAccount(username).stream()
                .map(this::convertToResponse)
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

        return convertToResponse(commentRepository.save(comment));
    }

    @Override
    @Transactional
    public CommentResponse updateComment(Integer id, CommentCreateRequest request, Integer accountId) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getAccount().getAccountId().equals(accountId)) {
            throw new RuntimeException("You can only edit your own comments");
        }

        comment.setContent(request.getContent());
        comment.setRating(request.getRating());
        return convertToResponse(commentRepository.save(comment));
    }

    @Override
    @Transactional
    public void deleteComment(Integer id, Integer accountId) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getAccount().getAccountId().equals(accountId)) {
            throw new RuntimeException("Unauthorized delete attempt");
        }
        replyRepository.deleteByComment_CommentId(id);
        commentRepository.delete(comment);
    }

    // --- HELPER MAPPING ---

    private CommentResponse convertToResponse(Comment comment) {
        // Tìm kiếm reply tương ứng trong DB
        CommentReplyResponse replyDto = replyRepository.findByComment_CommentId(comment.getCommentId())
                .map(r -> CommentReplyResponse.builder()
                        .replyId(r.getReplyId())
                        .content(r.getContent())
                        .adminName(r.getAccount().getFullName())
                        .createdAt(r.getCreatedAt().format(formatter))
                        .status(r.getStatus())
                        .build())
                .orElse(null);

        return CommentResponse.builder()
                .commentId(comment.getCommentId())
                .accountId(comment.getAccount().getAccountId())
                .username(comment.getAccount().getUsername())
                .fullName(comment.getAccount().getFullName())
                .content(comment.getContent())
                .rating(comment.getRating())
                .reviewDate(comment.getReviewDate() != null ? comment.getReviewDate().format(formatter) : null)
                .adminReply(replyDto) // Gắn dữ liệu reply vào response chính (Sửa lỗi số 4)
                .build();
    }
}