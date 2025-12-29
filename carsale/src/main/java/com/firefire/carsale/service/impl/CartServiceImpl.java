package com.firefire.carsale.service.impl;

import com.firefire.carsale.dto.request.AddToCartRequest;
import com.firefire.carsale.dto.request.UpdateCartRequest;
import com.firefire.carsale.dto.response.CartDetailResponse;
import com.firefire.carsale.dto.response.CartResponse;
import com.firefire.carsale.entity.Cart;
import com.firefire.carsale.entity.CartDetail;
import com.firefire.carsale.entity.Car;
import com.firefire.carsale.entity.Account;
import com.firefire.carsale.repository.CartDetailRepository;
import com.firefire.carsale.repository.CartRepository;
import com.firefire.carsale.repository.CarRepository;
import com.firefire.carsale.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartDetailRepository cartDetailRepository;
    private final CarRepository carRepository;

    @Override
    @Transactional(readOnly = true)
    public CartResponse getCartByUserId(Integer accountId) {
        Cart cart = cartRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Cart not found for user " + accountId));

        List<CartDetailResponse> items = cart.getCartDetails().stream().map(cd -> {
            CartDetailResponse dto = new CartDetailResponse();
            dto.setCartDetailId(cd.getCartDetailId());
            dto.setCarId(cd.getCar().getCarId());
            dto.setCarName(cd.getCar().getCarName());
            dto.setQuantity(cd.getQuantity());
            dto.setAddedAt(cd.getAddedAt());
            return dto;
        }).collect(Collectors.toList());

        CartResponse response = new CartResponse();
        response.setCartId(cart.getCartId());
        response.setItems(items);
        response.setTotalItems(items.stream().mapToInt(CartDetailResponse::getQuantity).sum());

        return response;
    }

    @Override
    @Transactional
    public void addToCart(Integer accountId, AddToCartRequest request) {
        Cart cart = cartRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Cart not found for user " + accountId));

        Car car = carRepository.findById(request.getCarId())
                .orElseThrow(() -> new RuntimeException("Car not found"));

        CartDetail cartDetail = cartDetailRepository.findByCartCartIdAndCarCarId(cart.getCartId(), car.getCarId())
                .orElseGet(() -> {
                    CartDetail cd = new CartDetail();
                    cd.setCart(cart);
                    cd.setCar(car);
                    cd.setQuantity(0);
                    return cd;
                });

        cartDetail.setQuantity(cartDetail.getQuantity() + request.getQuantity());
        cartDetailRepository.save(cartDetail);
    }

    @Override
    @Transactional
    public void updateCartDetail(Integer cartDetailId, UpdateCartRequest request) {
        CartDetail cartDetail = cartDetailRepository.findById(cartDetailId)
                .orElseThrow(() -> new RuntimeException("CartDetail not found"));
        cartDetail.setQuantity(request.getQuantity());
        cartDetailRepository.save(cartDetail);
    }

    @Override
    @Transactional
    public void removeCartDetail(Integer cartDetailId) {
        cartDetailRepository.deleteById(cartDetailId);
    }
}
