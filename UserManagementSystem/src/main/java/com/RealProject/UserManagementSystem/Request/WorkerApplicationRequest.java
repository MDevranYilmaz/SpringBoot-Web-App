package com.RealProject.UserManagementSystem.Request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkerApplicationRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String username;
    private String title;
    private String department;
    private String notes;
}
