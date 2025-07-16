package com.Alert.AnalyticsReportingSystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/v1/gateway")
public class gatewayController {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${analytics.base.url}")
    private String analyticsBaseUrl;

    @Value("${usermanagement.base.url}")
    private String userManagementBaseUrl;

    @GetMapping("/analytics/ai/generate-response")
    public ResponseEntity<String> generateAiResponse(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam String notes,
            @RequestParam String department,
            @RequestParam String jobTitle) {

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", authHeader);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        String url = analyticsBaseUrl + "/api/v1/ai/generate-response?notes=" + notes +
                "&department=" + department + "&jobTitle=" + jobTitle;

        return restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
    }

    @GetMapping("/hr/my-applications")
    public ResponseEntity<String> getMyApplications(@RequestHeader("Authorization") String authHeader) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", authHeader);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        String url = userManagementBaseUrl + "/api/v1/hr/my-applications";
        return restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
    }

    @GetMapping("/hr/admin/pending-applications")
    public ResponseEntity<String> getPendingApplications(@RequestHeader("Authorization") String authHeader) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", authHeader);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        String url = userManagementBaseUrl + "/api/v1/hr/admin/pending-applications";
        return restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
    }

    @GetMapping("/hr/admin/all-applications")
    public ResponseEntity<String> getAllApplications(@RequestHeader("Authorization") String authHeader) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", authHeader);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        String url = userManagementBaseUrl + "/api/v1/hr/admin/all-applications";
        return restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
    }

    @PostMapping("/hr/submit-application")
    public ResponseEntity<String> submitApplication(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody String request) {

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", authHeader);
        headers.set("Content-Type", "application/json");
        HttpEntity<String> entity = new HttpEntity<>(request, headers);

        String url = userManagementBaseUrl + "/api/v1/hr/submit-application";
        return restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
    }

    // ADD THIS MISSING ENDPOINT
    @PostMapping("/hr/admin/review-application")
    public ResponseEntity<String> reviewApplication(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody String request) {

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", authHeader);
        headers.set("Content-Type", "application/json");
        HttpEntity<String> entity = new HttpEntity<>(request, headers);

        String url = userManagementBaseUrl + "/api/v1/hr/admin/review-application";
        return restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
    }

}