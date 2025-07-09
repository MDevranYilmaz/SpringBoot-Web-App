package com.Alert.AnalyticsReportingSystem.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Alert.AnalyticsReportingSystem.AIService.AiService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @GetMapping("/generate-response")
    @CrossOrigin(origins = "http://localhost:5173")
    public ResponseEntity<String> generateAiResponse(
            @RequestParam String notes,
            @RequestParam String department,
            @RequestParam String jobTitle) {
        try {
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
