package com.streetbite.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${FRONTEND_URL:http://localhost:3000}")
    private String frontendUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendPasswordResetEmail(String to, String token) {
        String resetLink = frontendUrl + "/reset-password?token=" + token;

        // Log the link for development/debugging
        System.out.println("==================================================");
        System.out.println("PASSWORD RESET LINK FOR: " + to);
        System.out.println(resetLink);
        System.out.println("==================================================");

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("StreetBite - Password Reset Request");

            String htmlContent = """
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #ff6b35;">StreetBite Password Reset</h2>
                        <p>You requested to reset your password. Click the button below to proceed:</p>
                        <p style="margin: 30px 0;">
                            <a href="%s" style="background-color: #ff6b35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                                Reset Password
                            </a>
                        </p>
                        <p>Or copy and paste this link in your browser:</p>
                        <p style="word-break: break-all; color: #666;">%s</p>
                        <p style="color: #999; font-size: 12px; margin-top: 30px;">
                            This link expires in 15 minutes. If you didn't request this, please ignore this email.
                        </p>
                    </div>
                    """
                    .formatted(resetLink, resetLink);

            helper.setText(htmlContent, true);
            mailSender.send(message);

            System.out.println("Password reset email sent successfully to " + to);
        } catch (MessagingException e) {
            System.err.println("Failed to send email: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
