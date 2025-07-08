package com.RealProject.UserManagementSystem.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PasswordResetResponse {
    private String message;
    private boolean success;
}
