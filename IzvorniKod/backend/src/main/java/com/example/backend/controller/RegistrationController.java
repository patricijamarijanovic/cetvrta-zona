package com.example.backend.controller;

import com.example.backend.dto.LoginDto;
import com.example.backend.dto.OrganizationRegistrationDto;
import com.example.backend.dto.VolunteerRegistrationDto;
import com.example.backend.model.MyUser;
import com.example.backend.model.Organization;
import com.example.backend.model.Role;
import com.example.backend.model.Volunteer;
import com.example.backend.repository.MyUserRepository;
import com.example.backend.repository.VolunteerRepository;
import com.example.backend.service.OrganizationService;
import com.example.backend.service.VolunteerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/organization")
    public ResponseEntity<String> registerOrganization(@RequestBody OrganizationRegistrationDto organizationDto) {
        return organizationService.registerOrganization(organizationDto);
    }

}
