package com.firefire.carsale.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

import com.firefire.carsale.entity.enums.NewsStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.CreationTimestamp;

@Getter
@Setter
@Entity
@Table(name = "news")
public class News {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "news_id")
    private Integer newsId;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_account_id", nullable = false)
    @JsonIgnore
    private Account author;

    @CreationTimestamp
    @Column(name = "date", updatable = false)
    private LocalDateTime date;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private NewsStatus status = NewsStatus.draft;
}
