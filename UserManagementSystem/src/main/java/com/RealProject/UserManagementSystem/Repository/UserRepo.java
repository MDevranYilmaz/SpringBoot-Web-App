package com.RealProject.UserManagementSystem.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.RealProject.UserManagementSystem.entity.User;

public interface UserRepo extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Optional<User> findByEmailIgnoreCase(String email);
}
