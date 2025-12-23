package com.firefire.carsale.controller;

import com.firefire.carsale.entity.Car;
import com.firefire.carsale.entity.enums.CarStatus;
import com.firefire.carsale.service.CarService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
@CrossOrigin
public class CarController {

    private final CarService carService;

    @GetMapping
    public List<Car> getAll() {
        return carService.getAll();
    }

    @GetMapping("/{id}")
    public Car getById(@PathVariable Integer id) {
        return carService.getById(id);
    }

    @PostMapping
    public Car create(@RequestBody Car car) {
        return carService.create(car);
    }

    @PutMapping("/{id}")
    public Car update(@PathVariable Integer id, @RequestBody Car car) {
        return carService.update(id, car);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        carService.delete(id);
    }

    @GetMapping("/search")
    public List<Car> search(@RequestParam String keyword) {
        return carService.search(keyword);
    }

    @GetMapping("/status")
    public List<Car> filterByStatus(@RequestParam CarStatus status) {
        return carService.filterByStatus(status);
    }
}
