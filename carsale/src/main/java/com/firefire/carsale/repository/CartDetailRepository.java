package com.firefire.carsale.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.firefire.carsale.entity.CartDetail;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartDetailRepository extends JpaRepository<CartDetail, Integer> {

    List<CartDetail> findByCartCartId(Integer cartId);

    Optional<CartDetail> findByCartCartIdAndCarCarId(Integer cartId, Integer carId);

    @Query("SELECT COALESCE(SUM(cd.quantity), 0) FROM CartDetail cd WHERE cd.cart.cartId = :cartId")
    Integer countItemsInCart(@Param("cartId") Integer cartId);

    @Transactional
    @Modifying
    @Query("DELETE FROM CartDetail cd WHERE cd.cart.cartId = :cartId")
    void clearCart(@Param("cartId") Integer cartId);

    @Transactional
    @Modifying
    @Query("DELETE FROM CartDetail cd WHERE cd.cart.cartId = :cartId AND cd.car.carId = :carId")
    void removeItemFromCart(@Param("cartId") Integer cartId,
            @Param("carId") Integer carId);
}
