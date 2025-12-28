package com.firefire.carsale.seeder;

import com.firefire.carsale.entity.*;
import com.firefire.carsale.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Transactional
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final AccountRepository accountRepository;
    private final AccountRoleRepository accountRoleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("\n🚀 Starting data seeder...");
        createDefaultRoles();
        System.out.println("✅ Data seeder completed!\n");
    }

    private void createDefaultRoles() {
        if (roleRepository.count() == 0) {
            // Tạo role ADMIN
            Role adminRole = new Role();
            adminRole.setRoleName("admin");
            adminRole.setDescription("System Administrator");
            roleRepository.save(adminRole);
            System.out.println("✅ Created admin role");

            // Tạo role user (lowercase để match với code)
            Role userRole = new Role();
            userRole.setRoleName("user");
            userRole.setDescription("Regular User");
            roleRepository.save(userRole);
            System.out.println("✅ Created user role");

            // Tạo role manager (tùy chọn)
            Role managerRole = new Role();
            managerRole.setRoleName("manager");
            managerRole.setDescription("Manager");
            roleRepository.save(managerRole);
            System.out.println("✅ Created manager role");
        } else {
            System.out.println("ℹ️  Roles already exist, skipping...");
        }
    }
}