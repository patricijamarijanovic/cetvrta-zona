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
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/register")
public class RegistrationController {
    @Autowired
    private MyUserRepository myUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private VolunteerService volunteerService;

    @Autowired
    private OrganizationService organizationService;

//    @PostMapping("/admin")
//    public MyUser register(@RequestBody LoginDto loginDto) {
//        //bc I don't want to save it in the db using plain text
//        MyUser myUser = new MyUser();
//        myUser.setUsername(loginDto.getUsername());
//        myUser.setPassword(passwordEncoder.encode(loginDto.getPassword()));
//        myUser.setRole(Role.ADMIN);
//
//        return myUserRepository.save(myUser);
//    }

    @PostMapping("/volunteer")
    public ResponseEntity<String> registerVolunteer(@RequestBody VolunteerRegistrationDto volunteerDto) {
        return volunteerService.registerVolunteer(volunteerDto);
    }

    @PostMapping("/organization")
    public ResponseEntity<String> registerOrganization(@RequestBody OrganizationRegistrationDto organizationDto) {
        return organizationService.registerOrganization(organizationDto);
    }

}
