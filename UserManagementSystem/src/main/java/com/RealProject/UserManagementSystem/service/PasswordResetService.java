package com.RealProject.UserManagementSystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.RealProject.UserManagementSystem.Repository.UserRepo;
import com.RealProject.UserManagementSystem.entity.User;

import java.util.Optional;

@Service
public class PasswordResetService {

    @Autowired
    private UserRepo userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String initiatePasswordReset(String email) {
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email.trim());
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(email.trim());
            if (userOpt.isEmpty()) {
                throw new RuntimeException("No user found with email: " + email);
            }
        }

        User user = userOpt.get();
        System.out.println("Found user: " + user.getUsername() + " with email: " + user.getEmail());

        return emailService.sendVerificationCode(email);
    }

    public boolean verifyResetCode(String email, String code) {
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email.trim());
        if (userOpt.isEmpty()) {
            return false;
        }

        return emailService.verifyCode(email, code, false);
    }

    public String resetPassword(String email, String code, String newPassword) {
        if (!emailService.verifyCode(email, code)) {
            throw new RuntimeException("Invalid or expired verification code");
        }

        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email.trim());
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();

        if (newPassword == null || newPassword.length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters long");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        emailService.invalidateCode(email);

        return "Password reset successfully";
    }
}
