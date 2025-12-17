package com.firefire.carsale.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.firefire.carsale.entity.Cart;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {
    Optional<Cart> findByAccountAccountId(Integer accountId);

    boolean existsByAccountAccountId(Integer accountId);
}
