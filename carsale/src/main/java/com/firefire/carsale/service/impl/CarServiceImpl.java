package com.firefire.carsale.service.impl;

import com.firefire.carsale.entity.Car;
import com.firefire.carsale.entity.enums.CarStatus;
import com.firefire.carsale.repository.CarRepository;
import com.firefire.carsale.service.CarService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CarServiceImpl implements CarService {

    private final CarRepository carRepository;

    @Override
    public List<Car> getAll() {
        return carRepository.findAll();
    }

    @Override
    public Car getById(Integer id) {
        return carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found"));
    }

    @Override
    public Car create(Car car) {
        return carRepository.save(car);
    }

    @Override
    public Car update(Integer id, Car car) {
        Car existing = getById(id);
        existing.setCarName(car.getCarName());
        existing.setBrand(car.getBrand());
        existing.setPrice(car.getPrice());
        existing.setDescription(car.getDescription());
        existing.setImageUrl(car.getImageUrl());
        existing.setStatus(car.getStatus());
        return carRepository.save(existing);
    }

    @Override
    public void delete(Integer id) {
        carRepository.deleteById(id);
    }

    @Override
    public List<Car> search(String keyword) {
        return carRepository.search(keyword);
    }

    @Override
    public List<Car> filterByStatus(CarStatus status) {
        return carRepository.findByStatus(status);
    }
}
