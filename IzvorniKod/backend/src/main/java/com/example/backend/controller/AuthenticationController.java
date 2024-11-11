package com.example.backend.controller;

import com.example.backend.dto.LoginDto;
import com.example.backend.model.Project;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.security.JwtService;
import com.example.backend.security.MyUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class AuthenticationController {
	
	@Autowired
	private ProjectRepository projectrepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private MyUserDetailsService myUserDetailsService;

    @GetMapping("/home")
    public List<Project> home() {
    	return projectrepository.findAll();
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticateAndGetToken(@RequestBody LoginDto loginDto) {
        try {
            // Provodi autentifikaciju
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword())
            );

            // Ako je autentifikacija uspješna, generira JWT token
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