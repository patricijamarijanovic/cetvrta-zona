package com.example.backend.service;

import com.example.backend.dto.OrganizationRegistrationDto;
import com.example.backend.dto.ProjectDto;
import com.example.backend.dto.ProjectResponseDto;
import com.example.backend.model.*;
import com.example.backend.repository.GoogleUserRepository;
import com.example.backend.repository.MyUserRepository;
import com.example.backend.repository.OrganizationRepository;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.security.JwtService;
import com.example.backend.security.MyUserDetailsService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

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

    @Autowired
    private GoogleUserRepository googleUserRepository;

    @Autowired
    private MyUserDetailsService myUserDetailsService;

    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private EmailService emailService = new EmailService(new JavaMailSenderImpl());

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
        organization.setVerified(false);
        String verificationToken = UUID.randomUUID().toString();
        organization.setVerificationToken(verificationToken);
        emailService.sendVerificationEmail(dto.getEmail(), verificationToken);

        organizationRepository.save(organization);

        return ResponseEntity.ok("Organization registered successfully.");
    }

    public ResponseEntity<?> registerGoogleOrganization(String email) throws IOException {
        Optional<GoogleUser> u = googleUserRepository.findByEmail(email);

        if (u.isPresent()) {
            GoogleUser googleUser = u.get();

            Organization organization = new Organization();

            organization.setRole(Role.ORGANIZATION);
            organization.setEmail(googleUser.getEmail());
            organization.setOrganizationName(googleUser.getFirst_name() + " " + googleUser.getLast_name());
            organization.setUsername(googleUser.getEmail());
            organization.setPassword("oauth2");
            organization.setVerified(false);
            String verificationToken = UUID.randomUUID().toString();
            organization.setVerificationToken(verificationToken);
            emailService.sendVerificationEmail(googleUser.getEmail(), verificationToken);

            System.out.println("kreirana organizacija");
            System.out.println(organization);
            organizationRepository.save(organization);

            UserDetails userdetails = myUserDetailsService.loadUserByUsername(organization.getUsername());

            System.out.println(userdetails);

            String token = jwtService.generateToken(userdetails);
            System.out.println("token: " + token);

            String role = userdetails.getAuthorities().stream()
                    .map(grantedAuthority -> grantedAuthority.getAuthority())
                    .findFirst()
                    .orElse("ROLE_USER");

            // na ovoj putanji ce se token i uloga pohraniti na localstorage
//            String redirectUrl = "http://localhost:5173/login?token=" + token + "&role=" + role;
////            String redirectUrl = "https://volontirajsnama.onrender.com/login?token=" + token + "&role=" + role;
//
//            response.sendRedirect(redirectUrl);

            Map<String, String> response = new HashMap<>();
            response.put("jwt", token);
            response.put("role", role);
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed");
    }

    public ResponseEntity<Object> createproject(ProjectDto dto) {
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
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Projekt uspješno dodan :)");

        return ResponseEntity.ok(response);
    }

}
