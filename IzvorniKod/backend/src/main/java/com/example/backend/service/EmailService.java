package com.example.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        message.setFrom("noreply.volontirajsnama@yahoo.com");
        mailSender.send(message);
        System.out.println("Email sent successfully to " + to);
        return;
    }
    
    public void sendVerificationEmail(String to, String verificationToken) {
        String subject = "Potvrdite svoju e-mail adresu";
        String body = "Kliknite donji link kako biste potvrdili svoju e-mail adresu:\n" +
                      "http://localhost:8080/verify?token=" + verificationToken;
        
        this.sendEmail(to, subject, body);

        System.out.println("Verification email sent to " + to);
    }
}