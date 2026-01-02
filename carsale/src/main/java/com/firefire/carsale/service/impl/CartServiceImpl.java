package com.firefire.carsale.service.impl;

import com.firefire.carsale.dto.response.CartItemResponse;
import com.firefire.carsale.dto.response.CartResponse;
import com.firefire.carsale.entity.Car;
import com.firefire.carsale.entity.Cart;
import com.firefire.carsale.entity.CartDetail;
import com.firefire.carsale.repository.CarRepository;
import com.firefire.carsale.repository.CartDetailRepository;
import com.firefire.carsale.repository.CartRepository;
import com.firefire.carsale.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartDetailRepository cartDetailRepository;
    private final CarRepository carRepository;

    @Override
    public void addItemToCart(Integer accountId, Integer carId, Integer quantity) {
        Cart cart = cartRepository.findByAccountAccountId(accountId)
                .orElseThrow(() -> new RuntimeException("Giỏ hàng không tồn tại"));

        cartDetailRepository.findByCartCartIdAndCarCarId(cart.getCartId(), carId)
                .ifPresentOrElse(
                        detail -> {
                            detail.setQuantity(detail.getQuantity() + (quantity != null ? quantity : 1));
                            cartDetailRepository.save(detail);
                        },
                        () -> {
                            CartDetail newDetail = new CartDetail();
                            newDetail.setCart(cart);
                            Car car = carRepository.findById(carId)
                                    .orElseThrow(() -> new RuntimeException("Xe không tồn tại"));
                            newDetail.setCar(car);
                            newDetail.setQuantity(quantity != null ? quantity : 1);
                            cartDetailRepository.save(newDetail);
                        });
    }

    @Override
    @Transactional(readOnly = true)
    public CartResponse getCartDetails(Integer accountId) {
        Cart cart = cartRepository.findByAccountAccountId(accountId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giỏ hàng"));

        List<CartDetail> details = cartDetailRepository.findByCartCartId(cart.getCartId());

        // Fix lỗi: Sử dụng đúng Class CartItemResponse và map dữ liệu
        List<CartItemResponse> items = details.stream()
                .map(d -> new CartItemResponse(
                        d.getCar().getCarId(),
                        d.getCar().getCarName(),
                        d.getCar().getPrice(), // price trong Entity Car nên là BigDecimal
                        d.getQuantity()))
                .collect(Collectors.toList());

        // Fix lỗi: Nhân BigDecimal với Integer bằng .multiply()
        BigDecimal total = items.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        CartResponse response = new CartResponse();
        response.setItems(items);
        response.setTotalPrice(total);
        return response;
    }

    @Override
    public void removeItem(Integer accountId, Integer carId) {
        Cart cart = cartRepository.findByAccountAccountId(accountId).orElseThrow();
        cartDetailRepository.deleteByCartCartIdAndCarCarId(cart.getCartId(), carId);
    }

    @Override
    public void clearCart(Integer accountId) {
        Cart cart = cartRepository.findByAccountAccountId(accountId).orElseThrow();
        cartDetailRepository.deleteByCartCartId(cart.getCartId());
    }
}