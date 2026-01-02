package com.firefire.carsale.repository;

import com.firefire.carsale.entity.CommentReply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CommentReplyRepository extends JpaRepository<CommentReply, Integer> {

    // Tìm phản hồi dựa trên comment_id của bảng comments
    Optional<CommentReply> findByComment_CommentId(Integer commentId);

    // Xóa phản hồi khi xóa comment gốc
    void deleteByComment_CommentId(Integer commentId);
}