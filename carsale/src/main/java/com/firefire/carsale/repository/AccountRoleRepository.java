package com.firefire.carsale.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.firefire.carsale.entity.AccountRole;

import java.util.List;

@Repository
public interface AccountRoleRepository extends JpaRepository<AccountRole, Integer> {
    List<AccountRole> findByAccountAccountId(Integer accountId);

    List<AccountRole> findByRoleRoleId(Integer roleId);

    @Query("SELECT ar FROM AccountRole ar WHERE ar.account.accountId = :accountId AND ar.isActive = true")
    List<AccountRole> findActiveRolesByAccountId(@Param("accountId") Integer accountId);

    boolean existsByAccountAccountIdAndRoleRoleId(Integer accountId, Integer roleId);
}
