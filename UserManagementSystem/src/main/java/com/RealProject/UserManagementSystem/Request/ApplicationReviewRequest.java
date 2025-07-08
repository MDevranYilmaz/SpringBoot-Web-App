package com.RealProject.UserManagementSystem.Request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationReviewRequest {
    private Long applicationId;
    private boolean approved;
    private String rejectionReason;
}
