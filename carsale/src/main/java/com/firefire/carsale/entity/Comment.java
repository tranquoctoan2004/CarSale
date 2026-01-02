package com.firefire.carsale.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

import com.firefire.carsale.entity.enums.VisibilityStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.CreationTimestamp;

@Getter
@Setter
@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Integer commentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    @JsonIgnore
    private Account account;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_detail_id", nullable = true, unique = true)
    @JsonIgnore
    private OrderDetail orderDetail;

    @Column(name = "rating", nullable = false)
    private Integer rating;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @CreationTimestamp
    @Column(name = "review_date", updatable = false)
    private LocalDateTime reviewDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private VisibilityStatus status = VisibilityStatus.visible;

    /* ================== HELPER METHODS ================== */

    @Transient
    public Car getCar() {
        return orderDetail != null ? orderDetail.getCar() : null;
    }

    @Transient
    public Integer getCarId() {
        return (orderDetail != null && orderDetail.getCar() != null)
                ? orderDetail.getCar().getCarId()
                : null;
    }

    @Transient
    public String getAccountUsername() {
        return account != null ? account.getUsername() : null;
    }
}
