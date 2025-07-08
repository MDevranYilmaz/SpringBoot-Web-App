package com.RealProject.UserManagementSystem.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.RealProject.UserManagementSystem.Request.ApplicationReviewRequest;
import com.RealProject.UserManagementSystem.Request.WorkerApplicationRequest;
import com.RealProject.UserManagementSystem.Response.WorkerApplicationResponse;
import com.RealProject.UserManagementSystem.service.HRManagementService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/hr")
@RequiredArgsConstructor
public class HRController {

    private final HRManagementService hrService;

    @PostMapping("/submit-application")
    @PreAuthorize("hasAuthority('ROLE_HR')")
    public ResponseEntity<WorkerApplicationResponse> submitWorkerApplication(
            @RequestBody WorkerApplicationRequest request) {
        try {
            WorkerApplicationResponse response = hrService.submitWorkerApplication(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/my-applications")
    @PreAuthorize("hasAuthority('ROLE_HR')")
    public ResponseEntity<List<WorkerApplicationResponse>> getMyApplications() {
        System.out.println("Getting my applications for user");
        List<WorkerApplicationResponse> applications = hrService.getMySubmittedApplications();
        System.out.println("Found " + applications.size() + " applications");
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/admin/pending-applications")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<WorkerApplicationResponse>> getPendingApplications() {
        List<WorkerApplicationResponse> applications = hrService.getPendingApplications();
        return ResponseEntity.ok(applications);
    }

    @PostMapping("/admin/review-application")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<WorkerApplicationResponse> reviewApplication(
            @RequestBody ApplicationReviewRequest request) {
        try {
            WorkerApplicationResponse response = hrService.reviewApplication(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/admin/all-applications")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<WorkerApplicationResponse>> getAllApplications() {
        System.out.println("Getting all applications for admin user");
        List<WorkerApplicationResponse> applications = hrService.getAllApplications();
        System.out.println("Found " + applications.size() + " applications");
        return ResponseEntity.ok(applications);
    }
}