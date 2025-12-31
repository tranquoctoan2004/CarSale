package com.firefire.carsale.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.firefire.carsale.entity.Account;
import com.firefire.carsale.entity.AccountRole;

import java.util.List;

@Repository
public interface AccountRoleRepository extends JpaRepository<AccountRole, Integer> {

    List<AccountRole> findByAccountAccountId(Integer accountId);

    List<AccountRole> findByRoleRoleId(Integer roleId);

    List<AccountRole> findByAccountAccountIdAndIsActiveTrue(Integer accountId);

    boolean existsByAccountAccountIdAndRoleRoleId(Integer accountId, Integer roleId);

    void deleteByAccount(Account account);

}
