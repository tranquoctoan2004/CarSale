package com.firefire.carsale.controller;

import com.firefire.carsale.dto.request.AddToCartRequest;
import com.firefire.carsale.dto.request.UpdateCartRequest;
import com.firefire.carsale.dto.response.CartResponse;
import com.firefire.carsale.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // GET CART
    @GetMapping("/{accountId}")
    public CartResponse getCart(@PathVariable Integer accountId) {
        return cartService.getCartByUserId(accountId);
    }

    // ADD TO CART
    @PostMapping("/{accountId}/add")
    public String addToCart(@PathVariable Integer accountId,
            @RequestBody AddToCartRequest request) {
        cartService.addToCart(accountId, request);
        return "Added to cart";
    }

    // UPDATE QUANTITY
    @PutMapping("/update/{cartDetailId}")
    public String updateCart(@PathVariable Integer cartDetailId,
            @RequestBody UpdateCartRequest request) {
        cartService.updateCartDetail(cartDetailId, request);
        return "Updated cart detail";
    }

    // DELETE ITEM
    @DeleteMapping("/remove/{cartDetailId}")
    public String removeCartItem(@PathVariable Integer cartDetailId) {
        cartService.removeCartDetail(cartDetailId);
        return "Removed from cart";
    }
}
