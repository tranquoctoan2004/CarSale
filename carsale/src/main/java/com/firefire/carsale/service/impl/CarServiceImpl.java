package com.firefire.carsale.service.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.firefire.carsale.dto.request.CarRequest;
import com.firefire.carsale.dto.response.CarResponse;
import com.firefire.carsale.entity.Car;
import com.firefire.carsale.entity.enums.CarStatus;
import com.firefire.carsale.exception.ResourceNotFoundException;
import com.firefire.carsale.repository.CarRepository;
import com.firefire.carsale.service.CarService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CarServiceImpl implements CarService {

    private final CarRepository carRepository;

    @Override
    public List<CarResponse> getAllCars() {
        return carRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CarResponse getCarById(Integer id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found with id: " + id));
        return mapToResponse(car);
    }

    @Override
    public CarResponse createCar(CarRequest request) {
        Car car = new Car();
        mapToEntity(car, request);
        return mapToResponse(carRepository.save(car));
    }

    @Override
    public CarResponse updateCar(Integer id, CarRequest request) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found with id: " + id));

        mapToEntity(car, request);
        return mapToResponse(carRepository.save(car));
    }

    @Override
    public void deleteCar(Integer id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found with id: " + id));
        carRepository.delete(car);
    }

    @Override
    public List<CarResponse> searchCars(
            String brand,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            CarStatus status) {

        return carRepository.searchCars(brand, minPrice, maxPrice, status)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /* ================== MAPPING ================== */

    private CarResponse mapToResponse(Car car) {
        CarResponse res = new CarResponse();
        res.setCarId(car.getCarId());
        res.setCarName(car.getCarName());
        res.setBrand(car.getBrand());
        res.setPrice(car.getPrice());
        res.setDescription(car.getDescription());
        res.setImageUrl(car.getImageUrl());
        res.setStatus(car.getStatus());
        res.setCreatedAt(car.getCreatedAt());
        res.setUpdatedAt(car.getUpdatedAt());
        return res;
    }

    private void mapToEntity(Car car, CarRequest req) {
        car.setCarName(req.getCarName());
        car.setBrand(req.getBrand());
        car.setPrice(req.getPrice());
        car.setDescription(req.getDescription());
        car.setImageUrl(req.getImageUrl());
        car.setStatus(req.getStatus());
    }
}
