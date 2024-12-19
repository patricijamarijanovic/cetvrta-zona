package com.example.backend.controller;

import com.example.backend.dto.LoginDto;
import com.example.backend.dto.ProjectResponseDto;
import com.example.backend.model.Project;
import com.example.backend.repository.MyUserRepository;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.security.JwtService;
import com.example.backend.security.MyUserDetailsService;
import com.example.backend.service.EmailService;
import com.example.backend.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "https://volontirajsnama.onrender.com"})
public class AuthenticationController {
	
	@Autowired
    private EmailService emailService = new EmailService(new JavaMailSenderImpl());
	
	@Autowired
	private ProjectRepository projectrepository;
	
	@Autowired
	private MyUserRepository myUserRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private MyUserDetailsService myUserDetailsService;

    @Autowired
    private ProjectService projectService;

    @GetMapping("/home")
    public List<ProjectResponseDto> home() {
    	emailService.sendEmail("vbogojevic7@gmail.com", "test", "test");
        return projectService.getAllProjects();
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticateAndGetToken(@RequestBody LoginDto loginDto) {
        try {
            // Provodi autentifikaciju
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword())
            );
            
            // Ako je autentifikacija uspješna, provjerimo je li korisnik verificiran
            if (!myUserRepository.findByUsername(loginDto.getUsername()).get().isVerified()) {
            	return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed - e-mail adresa još nije potvrđena!\nMolimo vas da prije prijave potvrdite svoju e-mail adresu.");
            }

            // Ako je korisnik verificiran, generiramo JWT token
            if (authentication.isAuthenticated()) {
                String token = jwtService.generateToken(myUserDetailsService.loadUserByUsername(loginDto.getUsername()));

                String role = authentication.getAuthorities().stream()
                        .map(grantedAuthority -> grantedAuthority.getAuthority())
                        .findFirst()
                        .orElse("ROLE_USER");

                // Vraća JWT token u odgovoru
                Map<String, String> response = new HashMap<>();
                response.put("jwt", token);
                response.put("role", role);
                return ResponseEntity.ok(response);
            } else {
                // Ovo neće biti izvršeno jer je autentifikacija provjerena prije
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed");
            }

        } catch (Exception e) {
            // Ako je autentifikacija neuspješna, vraća odgovarajuću poruku o grešci
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Invalid username or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

}