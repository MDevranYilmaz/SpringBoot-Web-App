package com.Alert.AnalyticsReportingSystem.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Alert.AnalyticsReportingSystem.AIService.AiService;
import com.Alert.AnalyticsReportingSystem.AIService.JwtService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;
    private final JwtService jwtService;

    @GetMapping("/generate-response")
    @CrossOrigin(origins = "http://localhost:5173")
    public ResponseEntity<String> generateAiResponse(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam String notes,
            @RequestParam String department,
            @RequestParam String jobTitle) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Authorization header is missing or invalid");
            }

            String token = authHeader.substring(7);
            if (!jwtService.isTokenNotExpired(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid or expired token");
            }

            if (notes == null || notes.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Notes parameter is required");
            }
            if (department == null || department.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Department parameter is required");
            }
            if (jobTitle == null || jobTitle.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Job title parameter is required");
            }

            String response = aiService.getAiResponse(notes, department, jobTitle);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error generating AI response: " + e.getMessage());
        }
    }

}
