package com.firefire.carsale.service;

import java.util.List;

import com.firefire.carsale.dto.request.AdminUpdateUserRequest;
import com.firefire.carsale.dto.response.AccountResponse;

public interface AccountService {
    List<AccountResponse> getAllAccounts();

    AccountResponse getAccountById(Integer id);

    void deleteAccount(Integer id);

    void adminUpdateUser(Integer id, AdminUpdateUserRequest request);

}