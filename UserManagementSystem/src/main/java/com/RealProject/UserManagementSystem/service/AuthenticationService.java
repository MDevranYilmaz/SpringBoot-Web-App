package com.RealProject.UserManagementSystem.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.RealProject.UserManagementSystem.Repository.UserRepo;
import com.RealProject.UserManagementSystem.Request.AuthenticationRequest;
import com.RealProject.UserManagementSystem.Request.RegisterRequest;
import com.RealProject.UserManagementSystem.Response.AuthenticationResponse;
import com.RealProject.UserManagementSystem.entity.User;
import com.RealProject.UserManagementSystem.mapper.UserMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

        private final UserRepo repository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

        public AuthenticationResponse register(RegisterRequest request) {
                User user = User.builder()
                                .firstName(request.getFirstName())
                                .lastName(request.getLastName())
                                .email(request.getEmail())
                                .username(request.getUsername())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .title(request.getTitle())
                                .department(request.getDepartment())
                                .role(request.getRole())
                                .build();
                repository.save(user);
                String jwtToken = jwtService.generateToken(user);
                return AuthenticationResponse.builder()
                                .accessToken(jwtToken)
                                .tokenType("Bearer")
                                .user(UserMapper.userToDTO(user))
                                .build();
        }

        public AuthenticationResponse authenticate(AuthenticationRequest request) {
                System.out.println("Authentication attempt for username: " + request.getUsername());

                try {
                        authenticationManager
                                        .authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(),
                                                        request.getPassword()));

                        System.out.println("Authentication successful for: " + request.getUsername());

                        User user = repository.findByUsername(request.getUsername()).orElseThrow();
                        System.out.println("User found: " + user.getUsername() + ", Role: " + user.getRole());

                        String jwtToken = jwtService.generateToken(user);
                        System.out.println("JWT token generated successfully");

                        return AuthenticationResponse.builder()
                                        .accessToken(jwtToken)
                                        .tokenType("Bearer")
                                        .user(UserMapper.userToDTO(user))
                                        .build();
                } catch (Exception e) {
                        System.err.println("Authentication failed for: " + request.getUsername() + ", Error: "
                                        + e.getMessage());
                        throw e;
                }
        }

}
