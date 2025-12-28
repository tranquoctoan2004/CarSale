package com.firefire.carsale.dto.response;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

import com.firefire.carsale.entity.enums.AccountStatus;

@Data
public class AccountResponse {
    private Integer accountId;
    private String username;
    private String email;
    private AccountStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String fullName;
    private String phoneNumber;
    private List<String> roles;
}
