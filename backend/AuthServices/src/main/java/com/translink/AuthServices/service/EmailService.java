package com.translink.AuthServices.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    @Async("emailTaskExecutor") // Explicitly use a custom executor
    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("crimevault2@gmail.com"); // Set explicit 'from'
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception e) {
            // Log the error but don't block the user flow
            System.err.println("Email failed to send: " + e.getMessage());
        }
    }


    public void sendOperatorWelcomeEmail(String email, String firstName, String password) {
        String subject = "Your Operator Account Credentials";
        String body = String.format(
                "Welcome to the team, %s!\n\n" +
                        "Your account has been created successfully.\n\n" +
                        "Login ID: %s\n" +
                        "Temporary Password: %s\n\n" +
                        "Login here: http://localhost:4200/login\n\n" +
                        "Note: You will be required to change your password upon your first login for security purposes.",
                firstName, email, password
        );
        sendEmail(email, subject, body);
    }

    public void sendOtpEmail(String to, String otp) {
        sendEmail(to, "Verification Code", "Your code is: " + otp);
    }
}