package com.RealProject.UserManagementSystem.Response;

import com.RealProject.UserManagementSystem.dto.UserDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {
    private String accessToken;
    private String tokenType;
    private UserDTO user;
}