package com.firefire.carsale.service;

import com.firefire.carsale.dto.request.CarCreateRequest;
import com.firefire.carsale.dto.request.CarUpdateRequest;
import com.firefire.carsale.dto.response.CarResponse;
import com.firefire.carsale.entity.enums.CarStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

public interface CarService {
    Page<CarResponse> searchCars(String brand, String carName, BigDecimal minPrice,
            BigDecimal maxPrice, CarStatus status, Pageable pageable);

    CarResponse getCarById(Integer id);

    CarResponse createCar(CarCreateRequest request, MultipartFile image);

    CarResponse updateCar(Integer id, CarUpdateRequest request, MultipartFile image);

    void deleteCar(Integer id);
}