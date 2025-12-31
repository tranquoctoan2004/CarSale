package com.firefire.carsale.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class AdminCreateUserRequest {
    private String username;
    private String email;
    private String password;
    private String fullName;
    private String phoneNumber;
    private List<String> roles;
}
