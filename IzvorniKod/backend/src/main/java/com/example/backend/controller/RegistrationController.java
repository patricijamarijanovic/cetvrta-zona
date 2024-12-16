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
    public ResponseEntity<?> registerGoogleVolunteer(@RequestParam String email) throws IOException {
        return volunteerService.registerGoogleVolunteer(email);
    }

    @PostMapping("/organization")
    public ResponseEntity<String> registerOrganization(@RequestBody OrganizationRegistrationDto organizationDto) {
        return organizationService.registerOrganization(organizationDto);
    }

    @PostMapping("/organization/google")
    public ResponseEntity<?> registerGoogleOrganization(@RequestParam String email) throws IOException {
        organizationService.registerGoogleOrganization(email);
    }

}
