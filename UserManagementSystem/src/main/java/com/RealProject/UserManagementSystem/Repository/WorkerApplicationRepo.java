package com.RealProject.UserManagementSystem.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.RealProject.UserManagementSystem.Enum.ApplicationStatus;
import com.RealProject.UserManagementSystem.entity.User;
import com.RealProject.UserManagementSystem.entity.WorkerApplication;

@Repository
public interface WorkerApplicationRepo extends JpaRepository<WorkerApplication, Long> {
    List<WorkerApplication> findByStatus(ApplicationStatus status);

    List<WorkerApplication> findBySubmittedBy(User hrUser);

    List<WorkerApplication> findByStatusOrderBySubmittedAtDesc(ApplicationStatus status);

    boolean existsByUsernameAndStatusIn(String username, List<ApplicationStatus> statuses);

    boolean existsByEmailAndStatusIn(String email, List<ApplicationStatus> statuses);
}
