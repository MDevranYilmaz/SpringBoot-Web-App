package com.RealProject.UserManagementSystem.dto;

import com.RealProject.UserManagementSystem.Enum.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private long id;
    private String firstName;
    private String lastName;
    private String email;
    private String username;
    private String password;
    private String title;
    private String department;
    private Role role;
}
