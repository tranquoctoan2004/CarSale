package com.firefire.carsale.service;

import com.firefire.carsale.dto.request.AdminUpdateUserRequest;
import com.firefire.carsale.dto.response.AccountResponse;

public interface AdminAccountService {
    AccountResponse updateAccountByAdmin(
            Integer accountId,
            AdminUpdateUserRequest request);
}
