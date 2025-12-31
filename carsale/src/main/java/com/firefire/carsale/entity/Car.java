package com.firefire.carsale.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.firefire.carsale.entity.enums.CarStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Getter
@Setter
@Entity
@Table(name = "cars")
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "car_id")
    private Integer carId;

    @Column(name = "car_name", nullable = false, length = 100)
    private String carName;

    @Column(name = "brand", length = 50)
    private String brand;

    @Column(name = "price", nullable = false, precision = 15, scale = 2)
    private BigDecimal price;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private CarStatus status = CarStatus.available;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /* ================== RELATIONSHIPS ================== */

    @OneToMany(mappedBy = "car", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<CartDetail> cartDetails = new ArrayList<>();

    @OneToMany(mappedBy = "car", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<OrderDetail> orderDetails = new ArrayList<>();
}
