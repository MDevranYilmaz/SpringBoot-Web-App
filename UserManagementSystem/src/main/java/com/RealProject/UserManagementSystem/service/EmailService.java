package com.RealProject.UserManagementSystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.concurrent.TimeUnit;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Value("${spring.mail.username}")
    private String fromEmail;

    private static final int CODE_EXPIRY_MINUTES = 5;
    private static final String CODE_PREFIX = "reset_code:";

    private String generateVerificationCode() {
        SecureRandom random = new SecureRandom();
        int code = +random.nextInt(1000000); // Generates 6-digit number
        return String.valueOf(code);
    }

    public String sendVerificationCode(String email) {
        try {
            String verificationCode = generateVerificationCode();

            String redisKey = CODE_PREFIX + email;
            redisTemplate.opsForValue().set(redisKey, verificationCode, CODE_EXPIRY_MINUTES, TimeUnit.MINUTES);

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(email);
            message.setSubject("Password Reset Verification Code");
            message.setText(
                    "Hello,\n\n" +
                            "You have requested to reset your password. Please use the following verification code:\n\n"
                            +
                            "Verification Code: " + verificationCode + "\n\n" +
                            "This code will expire in " + CODE_EXPIRY_MINUTES + " minutes.\n\n" +
                            "If you did not request this, please ignore this email.\n\n" +
                            "Best regards,\n" +
                            "User Management System");

            mailSender.send(message);

            return "Verification code sent successfully to " + email;

        } catch (Exception e) {
            throw new RuntimeException("Failed to send verification code: " + e.getMessage());
        }
    }

    public boolean verifyCode(String email, String providedCode) {
        return verifyCode(email, providedCode, true); // Default: consume the code
    }

    public boolean verifyCode(String email, String providedCode, boolean consumeCode) {
        try {
            String redisKey = CODE_PREFIX + email;
            String storedCode = redisTemplate.opsForValue().get(redisKey);

            if (storedCode == null) {
                return false;
            }

            boolean isValid = storedCode.equals(providedCode);

            if (isValid && consumeCode) {
                redisTemplate.delete(redisKey);
            }

            return isValid;

        } catch (Exception e) {
            return false;
        }
    }

    public void invalidateCode(String email) {
        String redisKey = CODE_PREFIX + email;
        redisTemplate.delete(redisKey);
    }
}
