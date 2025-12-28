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

        // Tìm comment theo accountId
        @Query("SELECT c FROM Comment c WHERE c.account.accountId = :accountId")
        List<Comment> findByAccountId(@Param("accountId") Integer accountId);

        // Tìm comment theo carId thông qua orderDetail.car
        @Query("SELECT c FROM Comment c WHERE c.orderDetail.car.carId = :carId")
        List<Comment> findByCarId(@Param("carId") Integer carId);

        // Tìm comment theo trạng thái
        List<Comment> findByStatus(VisibilityStatus status);

        // Lấy rating trung bình theo carId và status
        @Query("SELECT AVG(c.rating) FROM Comment c WHERE c.orderDetail.car.carId = :carId AND c.status = :status")
        Double getAverageRatingByCarId(
                        @Param("carId") Integer carId,
                        @Param("status") VisibilityStatus status);

        // Tìm tất cả comment theo carId và status, sắp xếp theo ngày review
        @Query("SELECT c FROM Comment c WHERE c.orderDetail.car.carId = :carId AND c.status = :status ORDER BY c.reviewDate DESC")
        List<Comment> findCommentsByCarIdAndStatus(
                        @Param("carId") Integer carId,
                        @Param("status") VisibilityStatus status);

        // THÊM: Phương thức tìm comment visible theo carId (thường dùng nhất)
        @Query("SELECT c FROM Comment c WHERE c.orderDetail.car.carId = :carId AND c.status = 'visible' ORDER BY c.reviewDate DESC")
        List<Comment> findVisibleCommentsByCarId(@Param("carId") Integer carId);

        // THÊM: Phương thức đếm số comment theo carId và status
        @Query("SELECT COUNT(c) FROM Comment c WHERE c.orderDetail.car.carId = :carId AND c.status = :status")
        Long countCommentsByCarIdAndStatus(
                        @Param("carId") Integer carId,
                        @Param("status") VisibilityStatus status);
}