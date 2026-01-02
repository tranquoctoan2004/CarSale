package com.firefire.carsale.service.impl;

import com.firefire.carsale.dto.request.CarCreateRequest;
import com.firefire.carsale.dto.request.CarUpdateRequest;
import com.firefire.carsale.dto.response.CarResponse;
import com.firefire.carsale.entity.Car;
import com.firefire.carsale.entity.enums.CarStatus;
import com.firefire.carsale.exception.ResourceNotFoundException;
import com.firefire.carsale.repository.CarRepository;
import com.firefire.carsale.service.CarService;
import com.firefire.carsale.util.FileUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class CarServiceImpl implements CarService {

    private final CarRepository carRepository;

    // Lưu ý: Đã xóa fileUtil khỏi constructor vì ta gọi static method

    @Override
    public Page<CarResponse> searchCars(String brand, String carName, BigDecimal minPrice,
            BigDecimal maxPrice, CarStatus status, Pageable pageable) {
        return carRepository.searchCars(brand, carName, minPrice, maxPrice, status, pageable)
                .map(this::mapToResponse);
    }

    @Override
    public CarResponse getCarById(Integer id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found with id: " + id));
        return mapToResponse(car);
    }

    @Override
    public CarResponse createCar(CarCreateRequest request, MultipartFile image) {
        Car car = new Car();
        car.setCarName(request.getCarName());
        car.setBrand(request.getBrand());
        car.setPrice(request.getPrice());
        car.setStatus(request.getStatus());
        car.setDescription(request.getDescription());

        // Xử lý lưu ảnh
        if (image != null && !image.isEmpty()) {
            try {
                // Chỉ lấy kết quả từ FileUtil, không cộng thêm chuỗi
                String imagePath = FileUtil.saveFile(image, "uploads/cars");
                car.setImageUrl(imagePath);
            } catch (IOException e) {
                throw new RuntimeException("Could not store file. Error: " + e.getMessage());
            }
        }
        return mapToResponse(carRepository.save(car));

    }

    @Override
    public CarResponse updateCar(Integer id, CarUpdateRequest request, MultipartFile image) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found with id: " + id));

        car.setCarName(request.getCarName());
        car.setBrand(request.getBrand());
        car.setPrice(request.getPrice());
        car.setStatus(request.getStatus());
        car.setDescription(request.getDescription());

        if (image != null && !image.isEmpty()) {
            try {
                // Tương tự, gán trực tiếp imagePath
                String imagePath = FileUtil.saveFile(image, "uploads/cars");
                car.setImageUrl(imagePath);
            } catch (IOException e) {
                throw new RuntimeException("Could not update file. Error: " + e.getMessage());
            }
        }

        return mapToResponse(carRepository.save(car));
    }

    @Override
    public void deleteCar(Integer id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found with id: " + id));

        // (Tùy chọn) Xóa file vật lý khi xóa dữ liệu trong DB
        // if (car.getImageUrl() != null) {
        // FileUtil.deleteFile("." + car.getImageUrl());
        // }

        carRepository.delete(car);
    }

    private CarResponse mapToResponse(Car car) {
        // Đảm bảo class CarResponse có @Builder và trường description
        return CarResponse.builder()
                .carId(car.getCarId())
                .carName(car.getCarName())
                .brand(car.getBrand())
                .price(car.getPrice())
                .status(car.getStatus())
                .imageUrl(car.getImageUrl())
                .description(car.getDescription())
                .build();
    }
}