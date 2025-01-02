package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.service.VerifyService;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "https://volontirajsnama.onrender.com"})
public class VerificationController {
	
	@Autowired
	private VerifyService verifyService;
	
	@GetMapping("/verify")
    public String verifyUser(@RequestParam String token) {
        if (verifyService.verifyUser(token)) {
            return "Email adresa uspješno potvrđena!";
        } else {
            return "Nešto je pošlo po krivu.";
        }
    }

}
