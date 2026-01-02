package com.firefire.carsale.repository;

import com.firefire.carsale.entity.Comment;
import com.firefire.carsale.entity.enums.VisibilityStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {

  // Sửa lỗi: findAllVisibleWithAccount
  @Query("SELECT c FROM Comment c JOIN FETCH c.account WHERE c.status = :status ORDER BY c.reviewDate DESC")
  List<Comment> findAllVisibleWithAccount(@Param("status") VisibilityStatus status);

  // Sửa lỗi: searchByUsernameWithAccount (Bạn đang bị báo thiếu hàm này)
  @Query("SELECT c FROM Comment c JOIN FETCH c.account WHERE LOWER(c.account.username) LIKE LOWER(CONCAT('%', :username, '%'))")
  List<Comment> searchByUsernameWithAccount(@Param("username") String username);
}