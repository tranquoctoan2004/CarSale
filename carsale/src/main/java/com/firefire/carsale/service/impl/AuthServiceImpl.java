package com.firefire.carsale.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.firefire.carsale.dto.request.LoginRequest;
import com.firefire.carsale.dto.request.RegisterRequest;
import com.firefire.carsale.dto.response.AccountResponse;
import com.firefire.carsale.dto.response.LoginResponse;
import com.firefire.carsale.entity.Account;
import com.firefire.carsale.entity.AccountRole;
import com.firefire.carsale.entity.Cart;
import com.firefire.carsale.entity.Role;
import com.firefire.carsale.entity.enums.AccountStatus;
import com.firefire.carsale.repository.AccountRepository;
import com.firefire.carsale.repository.AccountRoleRepository;
import com.firefire.carsale.repository.CartRepository;
import com.firefire.carsale.repository.RoleRepository;
import com.firefire.carsale.security.SessionService;
import com.firefire.carsale.service.AuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private final AccountRepository accountRepository;
    private final CartRepository cartRepository;
    private final RoleRepository roleRepository;
    private final AccountRoleRepository accountRoleRepository;
    private final PasswordEncoder passwordEncoder;
    private final SessionService sessionService;

    private AccountResponse convertToResponse(Account account) {
        // Fetch roles từ repository thay vì từ lazy-loaded collection
        List<String> roles = accountRoleRepository.findByAccountAccountId(account.getAccountId())
                .stream()
                .filter(AccountRole::getIsActive)
                .map(ar -> ar.getRole().getRoleName())
                .collect(Collectors.toList());

        AccountResponse response = new AccountResponse();
        response.setAccountId(account.getAccountId());
        response.setUsername(account.getUsername());
        response.setEmail(account.getEmail());
        response.setStatus(account.getStatus());
        response.setCreatedAt(account.getCreatedAt());
        response.setUpdatedAt(account.getUpdatedAt());
        response.setFullName(account.getFullName());
        response.setPhoneNumber(account.getPhoneNumber());
        response.setRoles(roles);

        return response;
    }

    @Override
    @Transactional
    public AccountResponse register(RegisterRequest request) {
        // Validate username
        if (accountRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Validate email
        if (accountRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Validate password
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters");
        }

        // Create new account
        Account account = new Account();
        account.setUsername(request.getUsername());
        account.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        account.setEmail(request.getEmail());
        account.setFullName(request.getFullName());
        account.setPhoneNumber(request.getPhoneNumber());
        account.setStatus(AccountStatus.active);

        Account savedAccount = accountRepository.save(account);

        // Create cart for the account
        Cart cart = new Cart();
        cart.setAccount(savedAccount);
        cartRepository.save(cart);

        // Assign USER role to all accounts
        Role userRole = roleRepository.findByRoleName("user")
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setRoleName("user");
                    role.setDescription("Regular user");
                    return roleRepository.save(role);
                });

        AccountRole userAccountRole = new AccountRole();
        userAccountRole.setAccount(savedAccount);
        userAccountRole.setRole(userRole);
        userAccountRole.setIsActive(true);
        accountRoleRepository.save(userAccountRole);

        // If this is the first account, also assign ADMIN role
        boolean isFirstAccount = accountRepository.count() == 1;
        if (isFirstAccount) {
            Role adminRole = roleRepository.findByRoleName("admin")
                    .orElseGet(() -> {
                        Role role = new Role();
                        role.setRoleName("admin");
                        role.setDescription("Administrator");
                        return roleRepository.save(role);
                    });

            AccountRole adminAccountRole = new AccountRole();
            adminAccountRole.setAccount(savedAccount);
            adminAccountRole.setRole(adminRole);
            adminAccountRole.setIsActive(true);
            accountRoleRepository.save(adminAccountRole);

            System.out.println("🎉 First account registered with ADMIN privileges: " + account.getUsername());
        }

        System.out.println("✅ New account registered: " + account.getUsername() +
                " | Is admin: " + isFirstAccount);

        return convertToResponse(savedAccount);
    }

    @Override
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        // Find account by username
        Account account = accountRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Username not found"));

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), account.getPasswordHash())) {
            return LoginResponse.error("Invalid password");
        }

        // Check account status
        if (account.getStatus() == AccountStatus.inactive) {
            return LoginResponse.error("Account is inactive");
        }

        if (account.getStatus() == AccountStatus.banned) {
            return LoginResponse.error("Account is banned");
        }

        // Convert to response (will fetch roles inside convertToResponse)
        AccountResponse accountResponse = convertToResponse(account);

        // Create session token
        String token = sessionService.createSession(accountResponse);

        // Log login info
        System.out.println("✅ User logged in: " + account.getUsername() +
                " | Roles: " + accountResponse.getRoles());

        return LoginResponse.success("Login successful", accountResponse, token);
    }

    @Override
    @Transactional
    public void logout(String token) {
        sessionService.removeSession(token);
        System.out.println("✅ User logged out: " + token.substring(0, Math.min(10, token.length())) + "...");
    }

    @Override
    @Transactional(readOnly = true)
    public AccountResponse getCurrentUser(String token) {
        AccountResponse user = sessionService.getSession(token);
        if (user != null) {
            // Refresh user data from database
            Account account = accountRepository.findById(user.getAccountId())
                    .orElseThrow(() -> new RuntimeException("Account not found"));
            return convertToResponse(account);
        }
        return null;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isAdmin(Integer accountId) {
        return accountRoleRepository.findByAccountAccountId(accountId)
                .stream()
                .filter(AccountRole::getIsActive)
                .anyMatch(ar -> "admin".equals(ar.getRole().getRoleName()));
    }
}