package com.firefire.carsale.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.firefire.carsale.dto.filter.UserSearchFilter;
import com.firefire.carsale.dto.response.AccountResponse;
import com.firefire.carsale.service.AccountService;
import com.firefire.carsale.util.ApiResponse;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
@CrossOrigin
public class AccountController {

    private final AccountService accountService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getAllAccounts() {
        List<AccountResponse> accounts = accountService.getAllAccounts();
        return ResponseEntity.ok(ApiResponse.success(accounts));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountResponse>> getAccountById(@PathVariable Integer id) {
        AccountResponse account = accountService.getAccountById(id);
        return ResponseEntity.ok(ApiResponse.success(account));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAccount(@PathVariable Integer id) {
        accountService.deleteAccount(id);
        return ResponseEntity.ok(ApiResponse.success("Account deleted successfully", null));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<AccountResponse>>> searchAccounts(
            UserSearchFilter filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<AccountResponse> accounts = accountService.searchAccounts(filter, page, size);

        return ResponseEntity.ok(ApiResponse.success(accounts));
    }

}
