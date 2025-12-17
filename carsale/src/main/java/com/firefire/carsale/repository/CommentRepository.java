package com.firefire.carsale.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.firefire.carsale.entity.Comment;
import com.firefire.carsale.entity.enums.VisibilityStatus;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByCarCarId(Integer carId);
    List<Comment> findByAccountAccountId(Integer accountId);
    List<Comment> findByStatus(VisibilityStatus status);
    
    @Query("SELECT AVG(c.rating) FROM Comment c WHERE c.car.carId = :carId AND c.status = 'visible'")
    Double getAverageRatingByCarId(@Param("carId") Integer carId);
    
    @Query("SELECT c FROM Comment c WHERE c.car.carId = :carId AND c.status = 'visible' ORDER BY c.reviewDate DESC")
    List<Comment> findVisibleCommentsByCarId(@Param("carId") Integer carId);
}
