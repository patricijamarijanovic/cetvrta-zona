package com.example.backend.controller;

import com.example.backend.dto.LoginDto;
import com.example.backend.security.JwtService;
import com.example.backend.security.MyUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
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

                // Vraća JWT token u odgovoru
                Map<String, String> response = new HashMap<>();
                response.put("jwt", token);
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
