package com.firefire.carsale.service;

import com.firefire.carsale.dto.request.AddToCartRequest;
import com.firefire.carsale.dto.request.UpdateCartRequest;
import com.firefire.carsale.dto.response.CartResponse;

public interface CartService {
    CartResponse getCartByUserId(Integer accountId);

    void addToCart(Integer accountId, AddToCartRequest request);

    void updateCartDetail(Integer cartDetailId, UpdateCartRequest request);

    void removeCartDetail(Integer cartDetailId);
}
