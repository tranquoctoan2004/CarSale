package com.firefire.carsale.controller;

import com.firefire.carsale.entity.News;
import com.firefire.carsale.entity.enums.NewsStatus;
import com.firefire.carsale.repository.NewsRepository;
import com.firefire.carsale.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
@CrossOrigin(originPatterns = "*", allowCredentials = "true") // Cho phép gọi từ mọi trình duyệt
public class NewsPublicController {

    private final NewsRepository newsRepository;

    @GetMapping("/public")
    public ResponseEntity<?> getPublicNews() {
        try {
            // Lấy danh sách tin tức đã xuất bản
            // Lưu ý: NewsStatus.published phải khớp với Enum của bạn
            List<News> publicNews = newsRepository.findByStatus(NewsStatus.published);

            return ResponseEntity.ok(ApiResponse.success("Get public news success", publicNews));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(ApiResponse.error("Lỗi server: " + e.getMessage()));
        }
    }
}