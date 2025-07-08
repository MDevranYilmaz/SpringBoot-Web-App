package com.RealProject.UserManagementSystem.Request;

import com.RealProject.UserManagementSystem.Enum.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    private String firstName;
    private String lastName;
    private String email;
    private String username;
    private String password;
    private String title;
    private String department;
    private Role role;
}
