package com.firefire.carsale.service;

import com.firefire.carsale.dto.response.CartResponse;

public interface CartService {
    void addItemToCart(Integer accountId, Integer carId, Integer quantity);

    CartResponse getCartDetails(Integer accountId);

    void removeItem(Integer accountId, Integer carId);

    void clearCart(Integer accountId);
}