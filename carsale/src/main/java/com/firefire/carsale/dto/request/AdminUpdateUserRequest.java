package com.firefire.carsale.dto.request;

import lombok.Data;
import java.util.List;
import com.firefire.carsale.entity.enums.AccountStatus;

@Data
public class AdminUpdateUserRequest {
    private AccountStatus status;
    private List<String> roles;
}
