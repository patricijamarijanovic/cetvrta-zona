package com.example.backend.security;

import com.example.backend.model.MyUser;
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
    private JwtService jwtService;  // Inject JwtService

    @Autowired
    private MyUserDetailsService myUserDetailsService;


    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, IOException {
        ObjectMapper objectMapper = new ObjectMapper();

        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

        // Dohvatiti email korisnika iz OAuth2User atributa
        String email = oauth2User.getAttribute("email");

        System.out.println("Email korisnika: " + email);

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

//            Map<String, String> responseBody = new HashMap<>();
//            responseBody.put("jwt", token);
//            responseBody.put("role", role);
//
//            // Postavi status i vrati odgovor
//            response.setStatus(HttpServletResponse.SC_OK);
////            response.setContentType("application/json");
//
//            objectMapper.writeValue(response.getOutputStream(), responseBody);

           // na ovoj putanji ce se token i role pohraniti na localstorage
            //String redirectUrl = "http://localhost:5173/login?token=" + token + "&role=" + role;
            String redirectUrl = "http://https://volontirajsnama.onrender.com/login?token=" + token + "&role=" + role;
            response.sendRedirect(redirectUrl);



        }else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "User not found");
            response.setContentType("application/json");
            objectMapper.writeValue(response.getOutputStream(), errorResponse);
        }

    }
}