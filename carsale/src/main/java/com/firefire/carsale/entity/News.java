package com.firefire.carsale.entity;

import com.firefire.carsale.entity.enums.NewsStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "news", schema = "public")
public class News {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "news_id")
    private Integer newsId;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "content", columnDefinition = "text", nullable = false)
    private String content;

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @Column(name = "date", updatable = false)
    @CreationTimestamp
    private LocalDateTime date;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private NewsStatus status = NewsStatus.draft;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "author_account_id", nullable = false)
    private Account author;
}