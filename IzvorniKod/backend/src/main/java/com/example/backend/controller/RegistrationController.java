package com.example.backend.controller;

import com.example.backend.dto.OrganizationRegistrationDto;
import com.example.backend.dto.VolunteerRegistrationDto;
import com.example.backend.service.OrganizationService;
import com.example.backend.service.VolunteerService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "https://volontirajsnama.onrender.com"})
@RequestMapping("/register")
public class RegistrationController {

    @Autowired
    private VolunteerService volunteerService;

    @Autowired
    private OrganizationService organizationService;

    @PostMapping("/volunteer")
    public ResponseEntity<String> registerVolunteer(@RequestBody VolunteerRegistrationDto volunteerDto) {
        return volunteerService.registerVolunteer(volunteerDto);
    }

    @PostMapping("/volunteer/google")
    public void registerGoogleVolunteer(@RequestParam String email, HttpServletResponse response) throws IOException {
        volunteerService.registerGoogleVolunteer(email, response);
    }

    @PostMapping("/organization")
    public ResponseEntity<String> registerOrganization(@RequestBody OrganizationRegistrationDto organizationDto) {
        return organizationService.registerOrganization(organizationDto);
    }

    @PostMapping("/organization/google")
    public void registerGoogleOrganization(@RequestParam String email, HttpServletResponse response) throws IOException {
        organizationService.registerGoogleOrganization(email, response);
    }

}
