package com.firefire.carsale.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.firefire.carsale.dto.request.AdminUpdateUserRequest;
import com.firefire.carsale.dto.response.AccountResponse;
import com.firefire.carsale.entity.Account;
import com.firefire.carsale.entity.AccountRole;
import com.firefire.carsale.entity.Role;
import com.firefire.carsale.repository.AccountRepository;
import com.firefire.carsale.repository.AccountRoleRepository;
import com.firefire.carsale.repository.RoleRepository;
import com.firefire.carsale.service.AccountService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final AccountRoleRepository accountRoleRepository;
    private final RoleRepository roleRepository; // ✅ BẮT BUỘC

    private AccountResponse convertToResponse(Account account) {
        AccountResponse response = new AccountResponse();
        response.setAccountId(account.getAccountId());
        response.setUsername(account.getUsername());
        response.setEmail(account.getEmail());
        response.setStatus(account.getStatus());
        response.setCreatedAt(account.getCreatedAt());
        response.setUpdatedAt(account.getUpdatedAt());
        response.setFullName(account.getFullName());
        response.setPhoneNumber(account.getPhoneNumber());

        List<String> roles = accountRoleRepository
                .findByAccountAccountId(account.getAccountId())
                .stream()
                .map(ar -> ar.getRole().getRoleName())
                .collect(Collectors.toList());

        response.setRoles(roles);
        return response;
    }

    @Transactional
    @Override
    public void adminUpdateUser(Integer id, AdminUpdateUserRequest request) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // update status
        if (request.getStatus() != null) {
            account.setStatus(request.getStatus());
        }

        // update roles (nếu có gửi lên)
        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            accountRoleRepository.deleteByAccount(account);

            for (String roleName : request.getRoles()) {
                Role role = roleRepository.findByRoleName(roleName)
                        .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

                AccountRole ar = new AccountRole();
                ar.setAccount(account);
                ar.setRole(role);

                accountRoleRepository.save(ar);
            }
        }
    }

    @Override
    public List<AccountResponse> getAllAccounts() {
        return accountRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AccountResponse getAccountById(Integer id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        return convertToResponse(account);
    }

    @Transactional
    @Override
    public void deleteAccount(Integer id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        accountRepository.delete(account);
    }
}
