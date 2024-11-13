package com.example.backend.service;

import com.example.backend.dto.OrganizationRegistrationDto;
import com.example.backend.dto.ProjectDto;
import com.example.backend.model.Organization;
import com.example.backend.model.Project;
import com.example.backend.model.Role;
import com.example.backend.model.Status;
import com.example.backend.repository.MyUserRepository;
import com.example.backend.repository.OrganizationRepository;
import com.example.backend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import static com.example.backend.model.Status.OPEN;

@Service
public class OrganizationService {
    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MyUserRepository myUserRepository;

    @Autowired
    private ProjectRepository projectRepository;


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

    public String createproject(ProjectDto dto) {
        Project project = new Project();
        project.setProjectname(dto.getProjectname());
        project.setProjectdesc(dto.getProjectdesc());
        project.setBeginningdate(dto.getBeginningdate());
        project.setEnddate(dto.getEnddate());
        project.setProjectlocation(dto.getProjectlocation());
        project.setNumregisteredvolunteers(dto.getNumregisteredvolunteers());
        project.setMaxnumvolunteers(dto.getMaxnumvolunteers());
        project.setUrgent(dto.getUrgent());
        project.setStatus(String.valueOf(OPEN));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Organization organization = organizationRepository.findByUsername(username);
        if (organization == null) {
            throw new RuntimeException("Organizacija nije pronađena za korisnika: " + username);
        }
        project.setOrganizationID(organization.getId());
        project.setStatus(String.valueOf(OPEN));

        projectRepository.save(project);
        return "projekt uspješno dodan :)";
    }
}
