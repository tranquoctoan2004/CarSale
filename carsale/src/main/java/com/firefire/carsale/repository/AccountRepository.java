package com.firefire.carsale.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.firefire.carsale.entity.Account;
import com.firefire.carsale.entity.enums.AccountStatus;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {

        Optional<Account> findByUsername(String username);

        Optional<Account> findByEmail(String email);

        boolean existsByUsername(String username);

        boolean existsByEmail(String email);

        List<Account> findByStatus(AccountStatus status);

        @Query("""
                            SELECT a FROM Account a
                            WHERE (:username IS NULL OR LOWER(a.username) LIKE LOWER(CONCAT('%', :username, '%')))
                              AND (:email IS NULL OR LOWER(a.email) LIKE LOWER(CONCAT('%', :email, '%')))
                              AND (:status IS NULL OR a.status = :status)
                        """)
        org.springframework.data.domain.Page<Account> searchAccounts(
                        @Param("username") String username,
                        @Param("email") String email,
                        @Param("status") AccountStatus status,
                        org.springframework.data.domain.Pageable pageable);
}
