package com.example.backend.controller;

import com.example.backend.dto.LoginDto;
import com.example.backend.security.JwtService;
import com.example.backend.security.MyUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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

    @PostMapping("/authenticate")
    public String authenticateAndGetToken(@RequestBody LoginDto loginDto) {
        // provjerava jesu li username i password dobri
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginDto.getUsername(),  loginDto.getPassword()
        ));

        // ako je dobro, vrati token
        if (authentication.isAuthenticated()){
            return jwtService.generateToken(myUserDetailsService.loadUserByUsername(loginDto.getUsername()));
        }else{
            throw new UsernameNotFoundException("invalid credentials :(");
        }
    }

}
