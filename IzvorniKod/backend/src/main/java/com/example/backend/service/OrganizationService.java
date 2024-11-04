package com.example.backend.service;

import com.example.backend.dto.OrganizationRegistrationDto;
import com.example.backend.model.Organization;
import com.example.backend.model.Role;
import com.example.backend.repository.OrganizationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class OrganizationService {
    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    public Organization registerOrganization(OrganizationRegistrationDto dto) {
        Organization organization = new Organization();
        organization.setOrganizationName(dto.getOrganizationName());
        organization.setEmail(dto.getEmail());
        organization.setPassword(passwordEncoder.encode(dto.getPassword()));
        organization.setUsername(dto.getUsername());
        organization.setRole(Role.ORGANIZATION);
        return organizationRepository.save(organization);
    }
}
