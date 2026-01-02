package com.firefire.carsale.controller;

import com.firefire.carsale.dto.response.CarResponse;
import com.firefire.carsale.entity.Car;
import com.firefire.carsale.entity.enums.CarStatus;
import com.firefire.carsale.repository.CarRepository;
import com.firefire.carsale.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
public class UserCarController {

    private final CarRepository carRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CarResponse>>> getAvailableCars() {

        List<Car> cars = carRepository.findByStatus(CarStatus.available);

        List<CarResponse> responses = cars.stream()
                .map(car -> CarResponse.builder()
                        .carId(car.getCarId())
                        .carName(car.getCarName())
                        .brand(car.getBrand())
                        .price(car.getPrice())
                        .description(car.getDescription())
                        .imageUrl(car.getImageUrl())
                        .status(car.getStatus())
                        .createdAt(car.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                ApiResponse.success("Get available cars success", responses));
    }
}
