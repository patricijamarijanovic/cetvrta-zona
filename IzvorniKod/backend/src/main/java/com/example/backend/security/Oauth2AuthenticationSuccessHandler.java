package com.example.backend.security;

import com.example.backend.model.GoogleUser;
import com.example.backend.model.MyUser;
import com.example.backend.repository.GoogleUserRepository;
import com.example.backend.repository.MyUserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
public class Oauth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private MyUserRepository myUserRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private MyUserDetailsService myUserDetailsService;

    @Autowired
    private GoogleUserRepository googleUserRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, IOException {
        ObjectMapper objectMapper = new ObjectMapper();

        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

        // Dohvatiti email korisnika iz OAuth2User atributa
        String email = oauth2User.getAttribute("email");
        String firstName = oauth2User.getAttribute("given_name");
        String lastName = oauth2User.getAttribute("family_name");

        System.out.println("Email korisnika: " + email);
        System.out.println("ime: " + firstName);
        System.out.println("prezime: " + lastName);


        Optional<MyUser> u = myUserRepository.findByEmail(email);
        if (u.isPresent()) {
            MyUser myUser = u.get();
            System.out.printf(myUser.toString());

            UserDetails userdetails = myUserDetailsService.loadUserByUsername(myUser.getUsername());

            String token = jwtService.generateToken(userdetails);

            String role = userdetails.getAuthorities().stream()
                    .map(grantedAuthority -> grantedAuthority.getAuthority())
                    .findFirst()
                    .orElse("ROLE_USER");

           // na ovoj putanji ce se token i uloga pohraniti na localstorage
            String redirectUrl = "http://localhost:5173/login?token=" + token + "&role=" + role;
//            String redirectUrl = "https://volontirajsnama.onrender.com/login?token=" + token + "&role=" + role;
            response.sendRedirect(redirectUrl);

        }else {
            GoogleUser googleUser = new GoogleUser();
            googleUser.setEmail(email);
            googleUser.setFirst_name(firstName);
            googleUser.setLast_name(lastName);

            System.out.println(googleUser);
            googleUserRepository.save(googleUser);

            String redirectUrl = "http://localhost:5173/choose-role?email=" + email;
//            String redirectUrl = "http://volontirajsnama.onrender.com/choose-role?email=" + email;
            response.sendRedirect(redirectUrl);
        }
    }
}