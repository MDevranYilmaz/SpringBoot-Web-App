package com.RealProject.UserManagementSystem.service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.RealProject.UserManagementSystem.Enum.ApplicationStatus;
import com.RealProject.UserManagementSystem.Enum.Role;
import com.RealProject.UserManagementSystem.Repository.UserRepo;
import com.RealProject.UserManagementSystem.Repository.WorkerApplicationRepo;
import com.RealProject.UserManagementSystem.Request.ApplicationReviewRequest;
import com.RealProject.UserManagementSystem.Request.WorkerApplicationRequest;
import com.RealProject.UserManagementSystem.Response.WorkerApplicationResponse;
import com.RealProject.UserManagementSystem.entity.User;
import com.RealProject.UserManagementSystem.entity.WorkerApplication;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HRManagementService {

    private final WorkerApplicationRepo applicationRepo;
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    @CacheEvict(value = { "applications", "pendingApplications", "myApplications" }, allEntries = true)
    public WorkerApplicationResponse submitWorkerApplication(WorkerApplicationRequest request) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User hrUser = userRepo.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("HR user not found"));

        if (hrUser.getRole() != Role.HR) {
            throw new RuntimeException("Only HR users can submit worker applications");
        }

        List<ApplicationStatus> activeStatuses = Arrays.asList(ApplicationStatus.PENDING, ApplicationStatus.APPROVED);

        if (applicationRepo.existsByUsernameAndStatusIn(request.getUsername(), activeStatuses)) {
            throw new RuntimeException("Username already exists in pending or approved applications");
        }

        if (applicationRepo.existsByEmailAndStatusIn(request.getEmail(), activeStatuses)) {
            throw new RuntimeException("Email already exists in pending or approved applications");
        }

        if (userRepo.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists in the system");
        }

        // Generate a default password for the worker application
        String defaultPassword = "TempPass123!";

        WorkerApplication application = WorkerApplication.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .username(request.getUsername())
                .password(passwordEncoder.encode(defaultPassword))
                .title(request.getTitle())
                .department(request.getDepartment())
                .notes(request.getNotes())
                .status(ApplicationStatus.PENDING)
                .submittedBy(hrUser)
                .submittedAt(LocalDateTime.now())
                .build();

        WorkerApplication saved = applicationRepo.save(application);
        return mapToResponse(saved);
    }

    @CacheEvict(value = { "applications", "pendingApplications", "myApplications" }, allEntries = true)
    public WorkerApplicationResponse reviewApplication(ApplicationReviewRequest request) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User adminUser = userRepo.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        if (adminUser.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only admin users can review applications");
        }

        WorkerApplication application = applicationRepo.findById(request.getApplicationId())
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new RuntimeException("Application has already been reviewed");
        }

        if (request.isApproved()) {
            application.setStatus(ApplicationStatus.APPROVED);
            createWorkerUser(application);
        } else {
            application.setStatus(ApplicationStatus.REJECTED);
            application.setRejectionReason(request.getRejectionReason());
        }

        application.setReviewedBy(adminUser);
        application.setReviewedAt(LocalDateTime.now());

        WorkerApplication saved = applicationRepo.save(application);
        return mapToResponse(saved);
    }

    // @Cacheable("pendingApplications")
    public List<WorkerApplicationResponse> getPendingApplications() {
        System.out.println("Getting pending applications for admin user");
        List<WorkerApplication> pending = applicationRepo.findByStatusOrderBySubmittedAtDesc(ApplicationStatus.PENDING);
        System.out.println("Found " + pending.size() + " pending applications");
        return pending.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    // @Cacheable(value = "myApplications", key = "#root.methodName + '_' +
    // authentication.name")
    public List<WorkerApplicationResponse> getMySubmittedApplications() {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("Getting applications for user: " + currentUsername);
        User hrUser = userRepo.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("HR user not found"));

        List<WorkerApplication> applications = applicationRepo.findBySubmittedBy(hrUser);
        System.out.println("Found " + applications.size() + " applications for user: " + currentUsername);
        return applications.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    // @Cacheable("applications")
    public List<WorkerApplicationResponse> getAllApplications() {
        System.out.println("Getting all applications for admin user");
        List<WorkerApplication> applications = applicationRepo.findAll();
        System.out.println("Found " + applications.size() + " total applications");
        return applications.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private void createWorkerUser(WorkerApplication application) {
        User worker = User.builder()
                .firstName(application.getFirstName())
                .lastName(application.getLastName())
                .email(application.getEmail())
                .username(application.getUsername())
                .password(application.getPassword())
                .title(application.getTitle())
                .department(application.getDepartment())
                .role(Role.WORKER)
                .build();

        userRepo.save(worker);
    }

    private WorkerApplicationResponse mapToResponse(WorkerApplication application) {
        return WorkerApplicationResponse.builder()
                .id(application.getId())
                .firstName(application.getFirstName())
                .lastName(application.getLastName())
                .email(application.getEmail())
                .username(application.getUsername())
                .title(application.getTitle())
                .department(application.getDepartment())
                .notes(application.getNotes())
                .status(application.getStatus())
                .submittedByHR(application.getSubmittedBy().getUsername())
                .reviewedByAdmin(
                        (application.getReviewedBy() != null) ? application.getReviewedBy().getUsername() : null)
                .submittedAt(application.getSubmittedAt())
                .reviewedAt(application.getReviewedAt())
                .rejectionReason(application.getRejectionReason())
                .build();
    }
}
