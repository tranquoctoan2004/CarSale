package com.firefire.carsale.controller;

import com.firefire.carsale.dto.filter.UserSearchFilter;
import com.firefire.carsale.dto.request.AdminCreateUserRequest;
import com.firefire.carsale.dto.request.AdminUpdateUserRequest;
import com.firefire.carsale.dto.response.AccountResponse;
import com.firefire.carsale.service.AccountService;
import com.firefire.carsale.util.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/accounts")
@RequiredArgsConstructor
public class AdminAccountController {

    private final AccountService accountService;

    /* ================= SEARCH ================= */
    @GetMapping
    public ResponseEntity<ApiResponse<List<AccountResponse>>> searchAccounts(
            @ModelAttribute UserSearchFilter filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        accountService.searchAccounts(filter, page, size)));
    }

    /* ================= CREATE ================= */
    @PostMapping
    public ResponseEntity<ApiResponse<Void>> createUser(
            @RequestBody @Valid AdminCreateUserRequest request) {

        accountService.adminCreateUser(request);
        return ResponseEntity.ok(ApiResponse.success());
    }

    /* ================= UPDATE ================= */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> updateUser(
            @PathVariable Integer id,
            @RequestBody @Valid AdminUpdateUserRequest request) {

        accountService.adminUpdateUser(id, request);
        return ResponseEntity.ok(ApiResponse.success());
    }

    /* ================= DELETE ================= */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Integer id) {
        accountService.deleteAccount(id);
        return ResponseEntity.ok(ApiResponse.success());
    }
}
