package com.firefire.carsale.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.firefire.carsale.dto.request.AdminUpdateUserRequest;
import com.firefire.carsale.dto.response.AccountResponse;
import com.firefire.carsale.entity.Account;
import com.firefire.carsale.entity.AccountRole;
import com.firefire.carsale.entity.Role;
import com.firefire.carsale.entity.enums.AccountStatus;
import com.firefire.carsale.repository.AccountRepository;
import com.firefire.carsale.repository.AccountRoleRepository;
import com.firefire.carsale.repository.RoleRepository;
import com.firefire.carsale.service.AdminAccountService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminAccountServiceImpl implements AdminAccountService {

    private final AccountRepository accountRepository;
    private final AccountRoleRepository accountRoleRepository;
    private final RoleRepository roleRepository;

    @Override
    public AccountResponse updateAccountByAdmin(
            Integer accountId,
            AdminUpdateUserRequest request) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        /* ===== UPDATE STATUS ===== */
        if (request.getStatus() != null) {
            account.setStatus(request.getStatus());
        }

        /* ===== UPDATE ROLES (NẾU CÓ) ===== */
        if (request.getRoles() != null && !request.getRoles().isEmpty()) {

            // deactivate old roles
            accountRoleRepository
                    .findByAccountAccountId(accountId)
                    .forEach(ar -> {
                        ar.setIsActive(false);
                        accountRoleRepository.save(ar);
                    });

            // add new roles
            for (String roleName : request.getRoles()) {
                Role role = roleRepository.findByRoleName(roleName)
                        .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

                AccountRole ar = new AccountRole();
                ar.setAccount(account);
                ar.setRole(role);
                ar.setIsActive(true);
                accountRoleRepository.save(ar);
            }
        }

        accountRepository.save(account);

        return toResponse(account);
    }

    private AccountResponse toResponse(Account account) {
        AccountResponse r = new AccountResponse();
        r.setAccountId(account.getAccountId());
        r.setUsername(account.getUsername());
        r.setEmail(account.getEmail());
        r.setStatus(account.getStatus());
        r.setCreatedAt(account.getCreatedAt());
        r.setUpdatedAt(account.getUpdatedAt());

        List<String> roles = accountRoleRepository
                .findByAccountAccountId(account.getAccountId())
                .stream()
                .filter(AccountRole::getIsActive)
                .map(ar -> ar.getRole().getRoleName())
                .collect(Collectors.toList());

        r.setRoles(roles);
        return r;
    }
}
