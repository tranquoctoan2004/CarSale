package com.firefire.carsale.service;

import java.math.BigDecimal;
import java.util.List;

import com.firefire.carsale.dto.request.CarRequest;
import com.firefire.carsale.dto.response.CarResponse;
import com.firefire.carsale.entity.enums.CarStatus;

public interface CarService {

    List<CarResponse> getAllCars();

    CarResponse getCarById(Integer id);

    CarResponse createCar(CarRequest request);

    CarResponse updateCar(Integer id, CarRequest request);

    void deleteCar(Integer id);

    List<CarResponse> searchCars(
            String brand,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            CarStatus status);
}
