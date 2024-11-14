package com.example.backend.service;

import com.example.backend.dto.VolunteerRegistrationDto;
import com.example.backend.model.Role;
import com.example.backend.model.Volunteer;
import com.example.backend.repository.MyUserRepository;
import com.example.backend.repository.VolunteerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class VolunteerService {
    @Autowired
    private VolunteerRepository volunteerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MyUserRepository myUserRepository;

    public ResponseEntity<String> registerVolunteer(VolunteerRegistrationDto dto) {
        if (myUserRepository.existsByUsername(dto.getUsername())) {
            return ResponseEntity.badRequest().body("Username already taken. Please choose another one.");
        }

        if (myUserRepository.existsByEmail(dto.getEmail())) {
            return ResponseEntity.badRequest().body("Email already registered. Please choose another one.");
        }

        Volunteer volunteer = new Volunteer();
        volunteer.setUsername(dto.getUsername());
        volunteer.setPassword(passwordEncoder.encode(dto.getPassword()));
        volunteer.setFirstName(dto.getFirstName());
        volunteer.setLastName(dto.getLastName());
        volunteer.setEmail(dto.getEmail());
        volunteer.setDateOfBirth(dto.getDateOfBirth());
        volunteer.setRole(Role.VOLUNTEER);

        volunteerRepository.save(volunteer);

        return ResponseEntity.ok("Volunteer registered successfully.");
    }
}
