package com.firefire.carsale.dto.filter;

import lombok.Data;
import com.firefire.carsale.entity.enums.AccountStatus;

@Data
public class UserSearchFilter {
    private String username;
    private String email;
    private AccountStatus status;
}
