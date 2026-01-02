package com.firefire.carsale.repository;

import com.firefire.carsale.entity.CommentReply;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentReplyRepository extends JpaRepository<CommentReply, Integer> {
    List<CommentReply> findByCommentCommentId(Integer commentId);
}