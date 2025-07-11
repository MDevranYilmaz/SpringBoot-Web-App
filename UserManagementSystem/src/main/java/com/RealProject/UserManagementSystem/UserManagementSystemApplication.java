package com.RealProject.UserManagementSystem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.RealProject.UserManagementSystem.Enum.Role;
import com.RealProject.UserManagementSystem.Repository.UserRepo;
import com.RealProject.UserManagementSystem.entity.User;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
public class UserManagementSystemApplication {

	@Autowired
	private UserRepo userRepo;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public static void main(String[] args) {
		SpringApplication.run(UserManagementSystemApplication.class, args);
	}

	@PostConstruct
	public void initializeDefaultUsers() {
		try {
			System.out.println("Starting user initialization...");

			if (!userRepo.findByUsername("admin").isPresent()) {
				System.out.println("Creating admin user...");
				User admin = User.builder()
						.firstName("System")
						.lastName("Administrator")
						.email("admin@company.com")
						.username("admin")
						.password(passwordEncoder.encode("1234"))
						.title("System Administrator")
						.department("Information Technology")
						.role(Role.ADMIN)
						.build();

				userRepo.save(admin);
				System.out.println("Username: admin");
				System.out.println("Password: 1234");
				System.out.println("Role: ADMIN");
				System.out.println("Email: admin@company.com");
			} else {
				System.out.println("Admin user already exists");
			}

			if (!userRepo.findByUsername("hr1").isPresent()) {
				System.out.println("Creating HR user...");
				User hrUser = User.builder()
						.firstName("HR")
						.lastName("Manager")
						.email("muhammeddevranyilmaz@gmail.com")
						.username("hr1")
						.password(passwordEncoder.encode("1234"))
						.title("HR Manager")
						.department("Human Resources")
						.role(Role.HR)
						.build();

				userRepo.save(hrUser);
				System.out.println("Username: hr1");
				System.out.println("Password: 1234");
				System.out.println("Role: HR");
				System.out.println("Email: muhammeddevranyilmaz@gmail.com");
			} else {
				System.out.println("HR user already exists");
			}

			System.out.println("User initialization completed successfully!");
		} catch (Exception e) {
			System.err.println("Error during user initialization: " + e.getMessage());
			e.printStackTrace();
		}
	}
}
