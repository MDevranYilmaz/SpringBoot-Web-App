package com.RealProject.UserManagementSystem.entity;

import java.time.LocalDateTime;

import com.RealProject.UserManagementSystem.Enum.ApplicationStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "worker_applications")
public class WorkerApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String department;

    @Column(length = 1000)
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status;

    @ManyToOne
    @JoinColumn(name = "submittedByHR", nullable = false)
    private User submittedBy;

    @ManyToOne
    @JoinColumn(name = "reviewedByAdmin")
    private User reviewedBy;

    @Column(nullable = false)
    private LocalDateTime submittedAt;

    private LocalDateTime reviewedAt;

    @Column(length = 500)
    private String rejectionReason;

}
