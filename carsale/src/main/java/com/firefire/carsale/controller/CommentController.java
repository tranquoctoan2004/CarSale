package com.firefire.carsale.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.firefire.carsale.dto.request.CommentCreateRequest;
import com.firefire.carsale.service.CommentService;
import com.firefire.carsale.security.SessionService;
import com.firefire.carsale.util.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final SessionService sessionService;

    /**
     * Helper: Trích xuất AccountId từ Header Authorization Bearer
     */
    private Integer getAccountIdFromToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return sessionService.getAccountIdByToken(token);
        }
        return null;
    }

    /**
     * 1. Lấy tất cả bình luận hiển thị
     * (Công khai - Không cần token)
     */
    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(ApiResponse.success(commentService.getAllVisibleComments()));
    }

    /**
     * 2. Tìm kiếm bình luận theo username
     * (Công khai - Không cần token)
     */
    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam String username) {
        return ResponseEntity.ok(ApiResponse.success(commentService.searchByUsername(username)));
    }

    /**
     * 3. Thêm bình luận mới
     * (Yêu cầu đăng nhập - Dùng Bearer Token)
     */
    @PostMapping
    public ResponseEntity<?> create(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody CommentCreateRequest request) {

        Integer currentUid = getAccountIdFromToken(authHeader);
        if (currentUid == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Phiên đăng nhập hết hạn hoặc không hợp lệ!"));
        }

        return ResponseEntity.ok(ApiResponse.success(commentService.createComment(request, currentUid)));
    }

    /**
     * 4. Cập nhật bình luận
     * (Yêu cầu chính chủ - Check quyền trong Service)
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Integer id,
            @RequestBody CommentCreateRequest request) {

        Integer currentUid = getAccountIdFromToken(authHeader);
        if (currentUid == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Vui lòng đăng nhập!"));
        }

        return ResponseEntity.ok(ApiResponse.success(commentService.updateComment(id, request, currentUid)));
    }

    /**
     * 5. Xóa bình luận
     * (Yêu cầu chính chủ - Check quyền trong Service)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Integer id) {

        Integer currentUid = getAccountIdFromToken(authHeader);
        if (currentUid == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Vui lòng đăng nhập!"));
        }

        commentService.deleteComment(id, currentUid);
        return ResponseEntity.ok(ApiResponse.success("Đã xóa bình luận thành công"));
    }
}