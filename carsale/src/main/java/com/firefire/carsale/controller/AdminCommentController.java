package com.firefire.carsale.controller;

import com.firefire.carsale.dto.filter.CommentSearchFilter;
import com.firefire.carsale.dto.request.CommentReplyRequest;
import com.firefire.carsale.dto.response.AccountResponse;
import com.firefire.carsale.dto.response.CommentResponse;
import com.firefire.carsale.security.SessionService; // Import SessionService
import com.firefire.carsale.service.CommentService;
import com.firefire.carsale.util.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/comments")
@RequiredArgsConstructor
@CrossOrigin // Hỗ trợ gọi API từ Frontend khác port
public class AdminCommentController {

    private final CommentService commentService;
    private final SessionService sessionService; // Tiêm SessionService vào để tra cứu UUID

    /* ================= SEARCH / LIST ================= */
    @GetMapping
    public ResponseEntity<ApiResponse<List<CommentResponse>>> searchComments(
            @ModelAttribute CommentSearchFilter filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        List<CommentResponse> comments = commentService.adminGetAllComments(filter, page, size);
        return ResponseEntity.ok(ApiResponse.success(comments));
    }

    /* ================= REPLY (CREATE/UPDATE REPLY) ================= */
    @PostMapping("/{id}/reply")
    public ResponseEntity<ApiResponse<Void>> replyComment(
            @PathVariable Integer id,
            @RequestBody @Valid CommentReplyRequest request,
            @RequestHeader("Authorization") String authHeader) {

        // 1. Kiểm tra Header Authorization
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Missing or invalid Authorization header"));
        }

        // 2. Trích xuất token UUID (cắt bỏ chuỗi "Bearer ")
        String token = authHeader.substring(7).trim();

        // 3. Tra cứu thông tin Admin từ SessionService thay vì JwtUtil
        AccountResponse adminSession = sessionService.getSession(token);

        // 4. Kiểm tra session có tồn tại không
        if (adminSession == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Session expired or invalid. Please login again."));
        }

        // 5. Lấy accountId từ session và thực hiện reply
        Integer adminId = adminSession.getAccountId();
        commentService.adminReplyComment(id, request.getContent(), adminId);

        return ResponseEntity.ok(ApiResponse.success("Reply submitted successfully", null));
    }

    /* ================= DELETE COMMENT ================= */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(@PathVariable Integer id) {
        commentService.adminDeleteComment(id);
        return ResponseEntity.ok(ApiResponse.success("Comment deleted successfully", null));
    }
}