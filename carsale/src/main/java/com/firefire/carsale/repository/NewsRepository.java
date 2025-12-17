package com.firefire.carsale.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.firefire.carsale.entity.News;
import com.firefire.carsale.entity.enums.NewsStatus;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<News, Integer> {
    List<News> findByStatus(NewsStatus status);

    List<News> findByAuthorAccountId(Integer authorId);

    @Query("SELECT n FROM News n WHERE n.status = 'published' ORDER BY n.date DESC")
    List<News> findPublishedNews();

    @Query("SELECT n FROM News n WHERE " +
            "(:title IS NULL OR LOWER(n.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
            "(:status IS NULL OR n.status = :status) AND " +
            "(:startDate IS NULL OR n.date >= :startDate) AND " +
            "(:endDate IS NULL OR n.date <= :endDate)")
    List<News> searchNews(@Param("title") String title,
            @Param("status") NewsStatus status,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
}
