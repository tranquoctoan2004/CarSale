package com.firefire.carsale.controller;

import com.firefire.carsale.dto.request.NewsCreateRequest;
import com.firefire.carsale.dto.request.NewsUpdateRequest;
import com.firefire.carsale.dto.response.NewsResponse;
import com.firefire.carsale.entity.enums.NewsStatus;
import com.firefire.carsale.service.NewsService;
import com.firefire.carsale.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/news")
@RequiredArgsConstructor
public class NewsController {

    private final NewsService newsService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<NewsResponse>>> getAllNews(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) NewsStatus status,
            @PageableDefault(size = 10) Pageable pageable) {

        Page<NewsResponse> news = newsService.searchNews(title, status, pageable);
        return ResponseEntity.ok(ApiResponse.success("Get news list success", news));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NewsResponse>> getNewsById(@PathVariable Integer id) {
        NewsResponse response = newsService.getNewsById(id);
        return ResponseEntity.ok(ApiResponse.success("Get news detail success", response));
    }

    @PostMapping(consumes = { "multipart/form-data" })
    public ResponseEntity<ApiResponse<NewsResponse>> addNews(
            @ModelAttribute NewsCreateRequest request,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        NewsResponse response = newsService.createNews(request, image);
        return ResponseEntity.ok(ApiResponse.success("News created successfully", response));
    }

    @PutMapping(value = "/{id}", consumes = { "multipart/form-data" })
    public ResponseEntity<ApiResponse<NewsResponse>> updateNews(
            @PathVariable Integer id,
            @ModelAttribute NewsUpdateRequest request,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        NewsResponse response = newsService.updateNews(id, request, image);
        return ResponseEntity.ok(ApiResponse.success("News updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNews(@PathVariable Integer id) {
        newsService.deleteNews(id);
        return ResponseEntity.ok(ApiResponse.success("News deleted successfully", null));
    }
}