# CarSale

carsale
├── pom.xml
├── mvnw
├── mvnw.cmd
├── .mvn/
│
├── src
│ ├── main
│ │ ├── java
│ │ │ └── com
│ │ │ └── carsale
│ │ │ ├── CarsaleApplication.java
│ │ │
│ │ │ ├── config/
│ │ │ │ ├── CorsConfig.java
│ │ │ │ ├── SwaggerConfig.java
│ │ │ │ └── WebMvcConfig.java
│ │ │
│ │ │ ├── security/
│ │ │ │ ├── SecurityConfig.java
│ │ │ │ ├── JwtAuthenticationFilter.java
│ │ │ │ ├── JwtProvider.java
│ │ │ │ ├── JwtAuthEntryPoint.java
│ │ │ │ └── CustomUserDetailsService.java
│ │ │
│ │ │ ├── controller/
│ │ │ │ ├── AuthController.java
│ │ │ │ ├── AccountController.java
│ │ │ │ ├── CarController.java
│ │ │ │ ├── CartController.java
│ │ │ │ ├── OrderController.java
│ │ │ │ ├── PaymentController.java
│ │ │ │ ├── CommentController.java
│ │ │ │ ├── NewsController.java
│ │ │ │ ├── ReportController.java
│ │ │ │ └── DashboardController.java
│ │ │
│ │ │ ├── service/
│ │ │ │ ├── AuthService.java
│ │ │ │ ├── AccountService.java
│ │ │ │ ├── CarService.java
│ │ │ │ ├── CartService.java
│ │ │ │ ├── OrderService.java
│ │ │ │ ├── PaymentService.java
│ │ │ │ ├── CommentService.java
│ │ │ │ ├── NewsService.java
│ │ │ │ └── ReportService.java
│ │ │
│ │ │ ├── service/impl/
│ │ │ │ ├── AuthServiceImpl.java
│ │ │ │ ├── AccountServiceImpl.java
│ │ │ │ ├── CarServiceImpl.java
│ │ │ │ ├── CartServiceImpl.java
│ │ │ │ ├── OrderServiceImpl.java
│ │ │ │ ├── PaymentServiceImpl.java
│ │ │ │ ├── CommentServiceImpl.java
│ │ │ │ ├── NewsServiceImpl.java
│ │ │ │ └── ReportServiceImpl.java
│ │ │
│ │ │ ├── repository/
│ │ │ │ ├── AccountRepository.java
│ │ │ │ ├── RoleRepository.java
│ │ │ │ ├── AccountRoleRepository.java
│ │ │ │ ├── CarRepository.java
│ │ │ │ ├── CartRepository.java
│ │ │ │ ├── CartDetailRepository.java
│ │ │ │ ├── OrderRepository.java
│ │ │ │ ├── OrderDetailRepository.java
│ │ │ │ ├── PaymentRepository.java
│ │ │ │ ├── CommentRepository.java
│ │ │ │ ├── NewsRepository.java
│ │ │ │ └── ReportRepository.java
│ │ │
│ │ │ ├── entity/
│ │ │ │ ├── Account.java
│ │ │ │ ├── Role.java
│ │ │ │ ├── AccountRole.java
│ │ │ │ ├── Car.java
│ │ │ │ ├── Cart.java
│ │ │ │ ├── CartDetail.java
│ │ │ │ ├── Order.java
│ │ │ │ ├── OrderDetail.java
│ │ │ │ ├── Payment.java
│ │ │ │ ├── Comment.java
│ │ │ │ ├── News.java
│ │ │ │ └── Report.java
│ │ │ │
│ │ │ ├── entity/enums/
│ │ │ │ ├── AccountStatus.java
│ │ │ │ ├── CarStatus.java
│ │ │ │ ├── OrderStatus.java
│ │ │ │ ├── PaymentMethod.java
│ │ │ │ ├── NewsStatus.java
│ │ │ │ └── ReportStatus.java
│ │ │
│ │ │ ├── dto/
│ │ │ │ ├── request/
│ │ │ │ └── response/
│ │ │
│ │ │ ├── exception/
│ │ │ │ ├── GlobalExceptionHandler.java
│ │ │ │ └── ResourceNotFoundException.java
│ │ │
│ │ │ └── util/
│ │ │ ├── ApiResponse.java
│ │ │ └── DateUtils.java
│ │
│ │ ├── resources
│ │ │ ├── static
│ │ │ │ ├── image/
│ │ │ │ ├── screen/ ← HTML (frontend)
│ │ │ │ ├── script/ ← JavaScript (fetch API)
│ │ │ │ ├── style/ ← CSS
│ │ │ │ └── sql/
│ │ │ │ └── init.sql
│ │ │ │
│ │ │ ├── templates/ ← (Thymeleaf – có/không đều OK)
│ │ │ └── application.properties
│ │
│ └── test
│ └── java/com/carsale
│ └── CarsaleApplicationTests.java
│
└── README.md

1. entity + enums - done
2. repository - done
3. dto - done
4. exception + util - done
5. service (interface)
6. service/impl (nghiệp vụ)
7. controller
8. config
9. security (JWT)
10. dashboard + report

java/com/firefire/carsale/
├── config/
│ ├── CorsConfig.java
│ └── WebMvcConfig.java
├── controller/
│ ├── AccountController.java
│ ├── AuthController.java
│ └── PageController.java
├── dto/
│ ├── filter/
│ │ ├── CarSearchFilter.java
│ │ └── UserSearchFilter.java
│ ├── request/
│ │ ├── AddToCartRequest.java
│ │ ├── AdminCreateUserRequest.java
│ │ ├── AdminUpdateUserRequest.java
│ │ ├── CarCreateRequest.java
│ │ ├── CarUpdateRequest.java
│ │ ├── CommentCreateRequest.java
│ │ ├── CreateOrderRequest.java
│ │ ├── LoginRequest.java
│ │ ├── NewsCreateRequest.java
│ │ ├── RegisterRequest.java
│ │ └── UpdateOrderStatusRequest.java
│ └── response/
│ ├── AccountResponse.java
│ ├── BestSellingCarDTO.java
│ ├── CarResponse.java
│ ├── CartItemResponse.java
│ ├── CartResponse.java
│ ├── CommentResponse.java
│ ├── DashboardSummary.java
│ ├── LoginResponse.java
│ ├── NewsResponse.java
│ └── OrderResponse.java
├── entity/
│ ├── enums/
│ ├── Account.java
│ ├── AccountRole.java
│ ├── Car.java
│ ├── Cart.java
│ ├── CartDetail.java
│ ├── Comment.java
│ ├── News.java
│ ├── Order.java
│ ├── OrderDetail.java
│ ├── Report.java
│ └── Role.java
├── exception/
│ ├── BadRequestException.java
│ ├── BusinessException.java
│ ├── ConflictException.java
│ ├── ErrorResponse.java
│ ├── ForbiddenException.java
│ ├── GlobalExceptionHandler.java
│ ├── ResourceNotFoundException.java
│ └── UnauthorizedException.java
├── repository/
│ ├── AccountRepository.java
│ ├── AccountRoleRepository.java
│ ├── CarRepository.java
│ ├── CartDetailRepository.java
│ ├── CartRepository.java
│ ├── CommentRepository.java
│ ├── NewsRepository.java
│ ├── OrderDetailRepository.java
│ ├── OrderRepository.java
│ ├── ReportRepository.java
│ └── RoleRepository.java
├── security/
│ ├── AuthInterceptor.java
│ ├── SecurityConfig.java
│ └── SessionService.java
├── seeder/
│ └── DataSeeder.java
├── service/
│ ├── impl/
│ │ ├── AccountServiceImpl.java
│ │ └── AuthServiceImpl.java
│ ├── AccountService.java
│ └── AuthService.java
├── util/
│ ├── ApiResponse.java
│ ├── DateUtil.java
│ ├── FileUtil.java
│ ├── JwtUtil.java
│ ├── PasswordUtil.java
│ └── ValidationUtil.java
└── CarsaleApplication.java
