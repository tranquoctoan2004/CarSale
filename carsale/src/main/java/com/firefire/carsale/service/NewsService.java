package com.firefire.carsale.service;

import com.firefire.carsale.dto.request.NewsCreateRequest;
import com.firefire.carsale.dto.request.NewsUpdateRequest;
import com.firefire.carsale.dto.response.NewsResponse;
import com.firefire.carsale.entity.enums.NewsStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface NewsService {
    Page<NewsResponse> searchNews(String title, NewsStatus status, Pageable pageable);

    NewsResponse getNewsById(Integer id);

    NewsResponse createNews(NewsCreateRequest request, MultipartFile image);

    NewsResponse updateNews(Integer id, NewsUpdateRequest request, MultipartFile image);

    void deleteNews(Integer id);
}