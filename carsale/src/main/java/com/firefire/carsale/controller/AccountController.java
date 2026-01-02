package com.firefire.carsale.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.firefire.carsale.dto.filter.UserSearchFilter;
import com.firefire.carsale.dto.response.AccountResponse;
import com.firefire.carsale.entity.Account;
import com.firefire.carsale.repository.AccountRepository;
import com.firefire.carsale.service.AccountService;
import com.firefire.carsale.service.AuthService;
import com.firefire.carsale.util.ApiResponse;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.Map;

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

    private final AccountRepository accountRepository;
    private final AuthService authService; // Tiêm vào để check token

    // 1. Lấy thông tin người đăng nhập thông qua Token
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(ApiResponse.error("Thiếu Token!"));
        }

        // Dùng authService để lấy thông tin từ token (giống AuthController)
        String pureToken = token.substring(7);
        AccountResponse currentUser = authService.getCurrentUser(pureToken);

        if (currentUser == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Token không hợp lệ!"));
        }

        // Tìm trong DB để lấy đầy đủ thông tin Entity
        Optional<Account> accountOpt = accountRepository.findByUsername(currentUser.getUsername());

        if (accountOpt.isPresent()) {
            return ResponseEntity.ok(ApiResponse.success(accountOpt.get()));
        } else {
            return ResponseEntity.status(404).body(ApiResponse.error("Không tìm thấy tài khoản"));
        }
    }

    // 2. Cập nhật thông tin của người đăng nhập
    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentAccount(
            @RequestHeader("Authorization") String token,
            @RequestBody Account details) {

        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized"));
        }

        String pureToken = token.substring(7);
        AccountResponse currentUser = authService.getCurrentUser(pureToken);

        if (currentUser == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Token invalid"));
        }

        // Tiến hành cập nhật
        return accountRepository.findByUsername(currentUser.getUsername()).map(acc -> {
            acc.setFullName(details.getFullName());
            acc.setEmail(details.getEmail());
            acc.setPhoneNumber(details.getPhoneNumber());

            accountRepository.save(acc);
            return ResponseEntity.ok(Map.of("message", "Cập nhật thành công!"));
        }).orElse(ResponseEntity.notFound().build());
    }
}
