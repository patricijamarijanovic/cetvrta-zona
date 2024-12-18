package com.example.backend_volontiranje.controller;


import com.example.backend_volontiranje.dto.LoginDto;
import com.example.backend_volontiranje.security.JwtService;
import com.example.backend_volontiranje.security.MyUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ContentController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private MyUserDetailsService myUserDetailsService;

    @GetMapping("/home")
    public String home() {
        return "home page";
    }

    @GetMapping("/volunteer/home")
    public String volunteer_home() {
        return "VOLUNTEER home page";
    }

    @GetMapping("/organization/home")
    public String organization_home() {
        return "ORGANIZATION home page";
    }

//    @PostMapping("/authenticate")
//    public String authenticateAndGetToken(@RequestBody LoginDto loginDto) {
//        // provjerava jesu li username i password dobri
//        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
//                loginDto.getUsername(),  loginDto.getPassword()
//        ));
//
//        // ako je dobro, vrati token
//        if (authentication.isAuthenticated()){
//            return jwtService.generateToken(myUserDetailsService.loadUserByUsername(loginDto.getUsername()));
//        }else{
//            throw new UsernameNotFoundException("invalid credentials :(");
//        }
//    }

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