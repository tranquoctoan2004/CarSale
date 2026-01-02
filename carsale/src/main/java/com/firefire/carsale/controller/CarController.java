package com.firefire.carsale.controller;

import com.firefire.carsale.dto.request.CarCreateRequest;
import com.firefire.carsale.dto.request.CarUpdateRequest;
import com.firefire.carsale.dto.response.CarResponse;
import com.firefire.carsale.entity.enums.CarStatus;
import com.firefire.carsale.service.CarService;
import com.firefire.carsale.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/admin/cars")
@RequiredArgsConstructor
public class CarController {

    private final CarService carService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<CarResponse>>> getAllCars(
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String carName,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) CarStatus status,
            @PageableDefault(size = 10) Pageable pageable) {

        Page<CarResponse> cars = carService.searchCars(brand, carName, minPrice, maxPrice, status, pageable);
        // Sửa lỗi: Sử dụng phương thức static success
        return ResponseEntity.ok(ApiResponse.success("Get car list success", cars));
    }

    @PostMapping(consumes = { "multipart/form-data" })
    public ResponseEntity<ApiResponse<CarResponse>> addCar(
            @ModelAttribute CarCreateRequest request,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        CarResponse response = carService.createCar(request, image);
        // Sửa lỗi: Sử dụng phương thức static success
        return ResponseEntity.ok(ApiResponse.success("Car created successfully", response));
    }

    @PutMapping(value = "/{id}", consumes = { "multipart/form-data" })
    public ResponseEntity<ApiResponse<CarResponse>> updateCar(
            @PathVariable Integer id,
            @ModelAttribute CarUpdateRequest request,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        CarResponse response = carService.updateCar(id, request, image);
        // Sửa lỗi: Sử dụng phương thức static success
        return ResponseEntity.ok(ApiResponse.success("Car updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCar(@PathVariable Integer id) {
        carService.deleteCar(id);
        // Sửa lỗi: Trả về null cho dữ liệu Void
        return ResponseEntity.ok(ApiResponse.success("Car deleted successfully", null));
    }
}