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

        @Query("SELECT c FROM Comment c WHERE c.account.accountId = :accountId")
        List<Comment> findByAccountId(@Param("accountId") Integer accountId);

        @Query("SELECT c FROM Comment c WHERE c.orderDetail.car.carId = :carId")
        List<Comment> findByCarId(@Param("carId") Integer carId);

        List<Comment> findByStatus(VisibilityStatus status);

        @Query("""
                            SELECT COALESCE(AVG(c.rating), 0)
                            FROM Comment c
                            WHERE c.orderDetail.car.carId = :carId
                              AND c.status = :status
                        """)
        Double getAverageRatingByCarId(
                        @Param("carId") Integer carId,
                        @Param("status") VisibilityStatus status);

        @Query("""
                            SELECT c FROM Comment c
                            WHERE c.orderDetail.car.carId = :carId
                              AND c.status = :status
                            ORDER BY c.reviewDate DESC
                        """)
        org.springframework.data.domain.Page<Comment> findCommentsByCarIdAndStatus(
                        @Param("carId") Integer carId,
                        @Param("status") VisibilityStatus status,
                        org.springframework.data.domain.Pageable pageable);

        @Query("""
                            SELECT COUNT(c)
                            FROM Comment c
                            WHERE c.orderDetail.car.carId = :carId
                              AND c.status = :status
                        """)
        Long countCommentsByCarIdAndStatus(
                        @Param("carId") Integer carId,
                        @Param("status") VisibilityStatus status);
}
