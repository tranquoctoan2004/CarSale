package com.firefire.carsale.repository;

import com.firefire.carsale.entity.News;
import com.firefire.carsale.entity.enums.NewsStatus;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NewsRepository extends JpaRepository<News, Integer> {
    List<News> findByStatus(NewsStatus status);

    @Query("SELECT n FROM News n WHERE " +
            "(:title IS NULL OR LOWER(CAST(n.title AS text)) LIKE LOWER(CONCAT('%', CAST(:title AS text), '%'))) AND " +
            "(:status IS NULL OR n.status = :status)")
    Page<News> searchNews(@Param("title") String title,
            @Param("status") NewsStatus status,
            Pageable pageable);
}