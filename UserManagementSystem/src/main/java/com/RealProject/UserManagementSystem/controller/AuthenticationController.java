package com.RealProject.UserManagementSystem.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.RealProject.UserManagementSystem.Request.AuthenticationRequest;
import com.RealProject.UserManagementSystem.Request.ForgotPasswordRequest;
import com.RealProject.UserManagementSystem.Request.RegisterRequest;
import com.RealProject.UserManagementSystem.Request.ResetPasswordRequest;
import com.RealProject.UserManagementSystem.Request.VerifyResetCodeRequest;
import com.RealProject.UserManagementSystem.Response.AuthenticationResponse;
import com.RealProject.UserManagementSystem.Response.PasswordResetResponse;
import com.RealProject.UserManagementSystem.service.AuthenticationService;
import com.RealProject.UserManagementSystem.service.PasswordResetService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;
    private final PasswordResetService passwordResetService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<PasswordResetResponse> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            String message = passwordResetService.initiatePasswordReset(request.getEmail());
            return ResponseEntity.ok(PasswordResetResponse.builder()
                    .message(message)
                    .success(true)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(PasswordResetResponse.builder()
                    .message(e.getMessage())
                    .success(false)
                    .build());
        }
    }

    @PostMapping("/verify-reset-code")
    public ResponseEntity<PasswordResetResponse> verifyResetCode(@RequestBody VerifyResetCodeRequest request) {
        try {
            boolean isValid = passwordResetService.verifyResetCode(request.getEmail(), request.getCode());
            if (isValid) {
                return ResponseEntity.ok(PasswordResetResponse.builder()
                        .message("Code verified successfully")
                        .success(true)
                        .build());
            } else {
                return ResponseEntity.badRequest().body(PasswordResetResponse.builder()
                        .message("Invalid or expired verification code")
                        .success(false)
                        .build());
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(PasswordResetResponse.builder()
                    .message("Code verification failed")
                    .success(false)
                    .build());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<PasswordResetResponse> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            String message = passwordResetService.resetPassword(request.getEmail(), request.getCode(),
                    request.getNewPassword());
            return ResponseEntity.ok(PasswordResetResponse.builder()
                    .message(message)
                    .success(true)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(PasswordResetResponse.builder()
                    .message(e.getMessage())
                    .success(false)
                    .build());
        }
    }
}
