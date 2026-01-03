package com.firefire.carsale.controller;

import com.firefire.carsale.entity.Order;
import com.firefire.carsale.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*") // Cho phép gọi từ Frontend
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    /**
     * API: Lấy danh sách đơn hàng (giỏ hàng) của người dùng
     * GET http://localhost:8080/api/orders/user/{accountId}
     */
    @GetMapping("/user/{accountId}")
    public ResponseEntity<?> getOrdersByUser(@PathVariable Integer accountId) {
        try {
            // Gọi hàm từ Repository của bạn
            List<Order> orders = orderRepository.findByAccountAccountId(accountId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", orders));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Lỗi: " + e.getMessage()));
        }
    }
}