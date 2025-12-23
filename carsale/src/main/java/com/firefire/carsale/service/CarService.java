package com.firefire.carsale.service;

import com.firefire.carsale.entity.Car;
import com.firefire.carsale.entity.enums.CarStatus;

import java.util.List;

public interface CarService {
    List<Car> getAll();

    Car getById(Integer id);

    Car create(Car car);

    Car update(Integer id, Car car);

    void delete(Integer id);

    List<Car> search(String keyword);

    List<Car> filterByStatus(CarStatus status);
}
