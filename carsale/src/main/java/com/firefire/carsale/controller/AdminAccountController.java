package com.firefire.carsale.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.firefire.carsale.dto.request.AdminUpdateUserRequest;
import com.firefire.carsale.dto.response.AccountResponse;
import com.firefire.carsale.service.AdminAccountService;
import com.firefire.carsale.util.ApiResponse;

@RestController
@RequestMapping("/api/admin/accounts")
@RequiredArgsConstructor
@CrossOrigin
public class AdminAccountController {

    private final AdminAccountService adminAccountService;

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountResponse>> updateAccount(
            @PathVariable Integer id,
            @RequestBody AdminUpdateUserRequest request) {

        AccountResponse updated = adminAccountService.updateAccountByAdmin(id, request);

        return ResponseEntity.ok(
                ApiResponse.success("User updated successfully", updated));
    }
}
