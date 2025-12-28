package com.firefire.carsale.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.firefire.carsale.dto.request.CarRequest;
import com.firefire.carsale.dto.response.CarResponse;
import com.firefire.carsale.entity.enums.CarStatus;
import com.firefire.carsale.service.CarService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
public class CarController {

    private final CarService carService;

    @GetMapping
    public List<CarResponse> getAllCars() {
        return carService.getAllCars();
    }

    @GetMapping("/{id}")
    public CarResponse getCarById(@PathVariable Integer id) {
        return carService.getCarById(id);
    }

    @PostMapping
    public CarResponse createCar(@RequestBody CarRequest request) {
        return carService.createCar(request);
    }

    @PutMapping("/{id}")
    public CarResponse updateCar(
            @PathVariable Integer id,
            @RequestBody CarRequest request) {
        return carService.updateCar(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteCar(@PathVariable Integer id) {
        carService.deleteCar(id);
    }

    @GetMapping("/search")
    public List<CarResponse> searchCars(
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) CarStatus status) {

        return carService.searchCars(brand, minPrice, maxPrice, status);
    }
}
