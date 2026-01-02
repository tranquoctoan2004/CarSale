package com.firefire.carsale.service.impl;

import com.firefire.carsale.dto.request.NewsCreateRequest;
import com.firefire.carsale.dto.request.NewsUpdateRequest;
import com.firefire.carsale.dto.response.NewsResponse;
import com.firefire.carsale.entity.Account;
import com.firefire.carsale.entity.News;
import com.firefire.carsale.entity.enums.NewsStatus;
import com.firefire.carsale.exception.ResourceNotFoundException;
import com.firefire.carsale.repository.AccountRepository;
import com.firefire.carsale.repository.NewsRepository;
import com.firefire.carsale.service.NewsService;
import com.firefire.carsale.util.FileUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class NewsServiceImpl implements NewsService {

    private final NewsRepository newsRepository;
    private final AccountRepository accountRepository;

    @Override
    public Page<NewsResponse> searchNews(String title, NewsStatus status, Pageable pageable) {
        return newsRepository.searchNews(title, status, pageable)
                .map(this::mapToResponse);
    }

    @Override
    public NewsResponse getNewsById(Integer id) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News not found with id: " + id));
        return mapToResponse(news);
    }

    @Override
    public NewsResponse createNews(NewsCreateRequest request, MultipartFile image) {
        // --- LOGIC AUTHOR MẶC ĐỊNH ID = 1 ---
        Account admin = accountRepository.findById(1)
                .orElseThrow(() -> new ResourceNotFoundException("Hệ thống chưa có tài khoản Admin ID = 1"));

        News news = new News();
        news.setTitle(request.getTitle());
        news.setContent(request.getContent());
        news.setStatus(request.getStatus());
        news.setAuthor(admin); // Gán admin làm tác giả

        if (image != null && !image.isEmpty()) {
            try {
                String imagePath = FileUtil.saveFile(image, "uploads/news");
                news.setImageUrl(imagePath);
            } catch (IOException e) {
                throw new RuntimeException("Could not store file. Error: " + e.getMessage());
            }
        }
        return mapToResponse(newsRepository.save(news));
    }

    @Override
    public NewsResponse updateNews(Integer id, NewsUpdateRequest request, MultipartFile image) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News not found with id: " + id));

        news.setTitle(request.getTitle());
        news.setContent(request.getContent());
        news.setStatus(request.getStatus());

        if (image != null && !image.isEmpty()) {
            try {
                String imagePath = FileUtil.saveFile(image, "uploads/news");
                news.setImageUrl(imagePath);
            } catch (IOException e) {
                throw new RuntimeException("Could not update file. Error: " + e.getMessage());
            }
        }

        return mapToResponse(newsRepository.save(news));
    }

    @Override
    public void deleteNews(Integer id) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News not found with id: " + id));
        newsRepository.delete(news);
    }

    private NewsResponse mapToResponse(News news) {
        return NewsResponse.builder()
                .newsId(news.getNewsId())
                .title(news.getTitle())
                .content(news.getContent())
                .imageUrl(news.getImageUrl())
                .status(news.getStatus() != null ? news.getStatus().name() : null)
                .authorName(news.getAuthor() != null ? news.getAuthor().getFullName() : "Unknown")
                .date(news.getDate())
                .build();
    }
}