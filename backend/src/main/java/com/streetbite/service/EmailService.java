package com.streetbite.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public void sendPasswordResetEmail(String to, String token) {
        // In a real application, this would use JavaMailSender
        System.out.println("==================================================");
        System.out.println("EMAIL SERVICE (MOCK)");
        System.out.println("To: " + to);
        System.out.println("Subject: Password Reset Request");
        System.out.println("Body: Your password reset token is: " + token);
        System.out.println("      This token expires in 15 minutes.");
        System.out.println("==================================================");
    }
}
