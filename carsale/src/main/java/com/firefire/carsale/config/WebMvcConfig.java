package com.firefire.carsale.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.firefire.carsale.security.AuthInterceptor;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    private final AuthInterceptor authInterceptor;

    public WebMvcConfig(AuthInterceptor authInterceptor) {
        this.authInterceptor = authInterceptor;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5500", "http://localhost:3000", "http://localhost:8080")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor)
                .addPathPatterns("/api/**", "/admin/**", "/dashboard/**") // Những đường dẫn cần bảo vệ
                .excludePathPatterns(
                        "/api/auth/**",
                        "/image/**",
                        "/uploads/**",
                        "/style/**",
                        "/script/**",
                        "/*.html");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String projectDir = System.getProperty("user.dir");

        // Khai báo rõ ràng cho cả 2 nguồn ảnh
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(
                        "file:D:/Big_Project/CarSale/carsale/uploads/", // Thư mục ngoài ổ D
                        "file:" + projectDir + "/uploads/" // Thư mục trong Project
                )
                .setCachePeriod(3600);
        registry.addResourceHandler("/image/**")
                .addResourceLocations("classpath:/static/image/");
    }
}
