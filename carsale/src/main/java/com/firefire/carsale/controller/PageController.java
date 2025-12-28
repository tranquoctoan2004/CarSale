package com.firefire.carsale.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/")
    public String home() {
        return "forward:/screen/guest/guest.html";
    }

    @GetMapping("/login")
    public String loginPage() {
        return "forward:/screen/user/login.html";
    }

    // THÊM: Route cho signup
    @GetMapping("/signup")
    public String signupPage() {
        return "forward:/screen/guest/signup.html";
    }

    @GetMapping("/about")
    public String aboutPage() {
        return "forward:/screen/user/about.html";
    }

    @GetMapping("/cars")
    public String carsPage() {
        return "forward:/screen/user/car.html";
    }

    @GetMapping("/terms")
    public String termsPage() {
        return "forward:/screen/user/condition.html";
    }

    @GetMapping("/news")
    public String newsPage() {
        return "forward:/screen/user/news.html";
    }

    @GetMapping("/dashboard")
    public String dashboard() {
        return "forward:/screen/user/userhome.html";
    }

    @GetMapping("/orders")
    public String ordersPage() {
        return "forward:/screen/user/order.html";
    }

    @GetMapping("/payment")
    public String paymentPage() {
        return "forward:/screen/user/payment.html";
    }

    @GetMapping("/profile")
    public String profilePage() {
        return "forward:/screen/user/updateinfo.html";
    }
}