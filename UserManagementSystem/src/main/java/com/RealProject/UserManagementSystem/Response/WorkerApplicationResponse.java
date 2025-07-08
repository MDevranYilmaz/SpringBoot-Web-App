package com.RealProject.UserManagementSystem.Response;

import java.time.LocalDateTime;

import com.RealProject.UserManagementSystem.Enum.ApplicationStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkerApplicationResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String username;
    private String title;
    private String department;
    private String notes;
    private ApplicationStatus status;
    private String submittedByHR;
    private String reviewedByAdmin;
    private LocalDateTime submittedAt;
    private LocalDateTime reviewedAt;
    private String rejectionReason;
}
