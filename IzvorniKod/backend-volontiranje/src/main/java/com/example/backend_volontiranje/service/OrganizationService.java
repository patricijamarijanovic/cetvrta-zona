package com.example.backend_volontiranje.service;


import com.example.backend_volontiranje.dto.OrganizationRegistrationDto;
import com.example.backend_volontiranje.model.Organization;
import com.example.backend_volontiranje.model.Role;
import com.example.backend_volontiranje.repository.MyUserRepository;
import com.example.backend_volontiranje.repository.OrganizationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class OrganizationService {
    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MyUserRepository myUserRepository;


    public ResponseEntity<String> registerOrganization(OrganizationRegistrationDto dto) {
        if (myUserRepository.existsByUsername(dto.getUsername())) {
            return ResponseEntity.badRequest().body("Username already taken. Please choose another one.");
        }

        if (myUserRepository.existsByEmail(dto.getEmail())) {
            return ResponseEntity.badRequest().body("Email already registered. Please choose another one.");
        }

        Organization organization = new Organization();
        organization.setOrganizationName(dto.getOrganizationName());
        organization.setEmail(dto.getEmail());
        organization.setPassword(passwordEncoder.encode(dto.getPassword()));
        organization.setUsername(dto.getUsername());
        organization.setRole(Role.ORGANIZATION);

        organizationRepository.save(organization);

        return ResponseEntity.ok("Organization registered successfully.");
    }
}
