package com.firefire.carsale.service;

import java.util.List;

import com.firefire.carsale.dto.filter.UserSearchFilter;
import com.firefire.carsale.dto.request.AdminCreateUserRequest;
import com.firefire.carsale.dto.request.AdminUpdateUserRequest;
import com.firefire.carsale.dto.response.AccountResponse;

public interface AccountService {
    List<AccountResponse> getAllAccounts();

    AccountResponse getAccountById(Integer id);

    void deleteAccount(Integer id);

    void adminUpdateUser(Integer id, AdminUpdateUserRequest request);

    List<AccountResponse> searchAccounts(UserSearchFilter filter, int page, int size);

    void adminCreateUser(AdminCreateUserRequest request);

}