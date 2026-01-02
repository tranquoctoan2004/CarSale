package com.firefire.carsale.repository;

import com.firefire.carsale.entity.CartDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CartDetailRepository extends JpaRepository<CartDetail, Integer> {
    Optional<CartDetail> findByCartCartIdAndCarCarId(Integer cartId, Integer carId);

    List<CartDetail> findByCartCartId(Integer cartId);

    void deleteByCartCartIdAndCarCarId(Integer cartId, Integer carId);

    void deleteByCartCartId(Integer cartId);
}