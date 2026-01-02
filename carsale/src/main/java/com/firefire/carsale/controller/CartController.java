package com.firefire.carsale.controller;

import com.firefire.carsale.dto.request.AddToCartRequest;
import com.firefire.carsale.dto.response.CartResponse;
import com.firefire.carsale.security.SessionService;
import com.firefire.carsale.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final SessionService sessionService;

    // Hàm tiện ích để kiểm tra token và lấy Account ID
    private Integer getValidAccountId(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        String token = authHeader.substring(7);
        return sessionService.getAccountIdByToken(token);
    }

    // 1. Lấy thông tin giỏ hàng (Khớp với loadCart() trong JS)
    @GetMapping
    public ResponseEntity<?> getMyCart(@RequestHeader("Authorization") String authHeader) {
        Integer accountId = getValidAccountId(authHeader);
        if (accountId == null) {
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "Vui lòng đăng nhập"));
        }

        try {
            CartResponse data = cartService.getCartDetails(accountId);
            return ResponseEntity.ok(Map.of("success", true, "data", data));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // 2. Thêm vào giỏ hàng (Hàm cũ của bạn, đã chuẩn hóa response)
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestHeader("Authorization") String authHeader,
            @RequestBody AddToCartRequest request) {
        Integer accountId = getValidAccountId(authHeader);
        if (accountId == null) {
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "Phiên làm việc hết hạn"));
        }

        try {
            cartService.addItemToCart(accountId, request.getCarId(), request.getQuantity());
            return ResponseEntity.ok(Map.of("success", true, "message", "Đã thêm vào giỏ hàng"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // 3. Xóa 1 sản phẩm khỏi giỏ (Khớp với removeItem(carId) trong JS)
    @DeleteMapping("/items/{carId}")
    public ResponseEntity<?> removeItem(@RequestHeader("Authorization") String authHeader,
            @PathVariable Integer carId) {
        Integer accountId = getValidAccountId(authHeader);
        if (accountId == null)
            return ResponseEntity.status(401).build();

        try {
            cartService.removeItem(accountId, carId);
            return ResponseEntity.ok(Map.of("success", true, "message", "Đã xóa sản phẩm"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // 4. Xóa toàn bộ giỏ hàng (Khớp với clearCart() trong JS)
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(@RequestHeader("Authorization") String authHeader) {
        Integer accountId = getValidAccountId(authHeader);
        if (accountId == null)
            return ResponseEntity.status(401).build();

        try {
            cartService.clearCart(accountId);
            return ResponseEntity.ok(Map.of("success", true, "message", "Giỏ hàng đã trống"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}