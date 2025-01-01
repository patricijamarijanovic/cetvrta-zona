package com.example.backend.service;

import com.example.backend.dto.ReviewDto;
import com.example.backend.dto.VolunteerRegistrationDto;
import com.example.backend.model.GoogleUser;
import com.example.backend.model.Review;
import com.example.backend.model.Role;
import com.example.backend.model.Volunteer;
import com.example.backend.repository.GoogleUserRepository;
import com.example.backend.repository.MyUserRepository;
import com.example.backend.repository.ReviewRepository;
import com.example.backend.repository.VolunteerRepository;
import com.example.backend.security.JwtService;
import com.example.backend.security.MyUserDetailsService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class VolunteerService {
    @Autowired
    private VolunteerRepository volunteerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MyUserRepository myUserRepository;

    @Autowired
    private GoogleUserRepository googleUserRepository;

    @Autowired
    private MyUserDetailsService myUserDetailsService;

    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private EmailService emailService = new EmailService(new JavaMailSenderImpl());
    
    @Autowired
    private ReviewRepository reviewRepository;

    public ResponseEntity<String> registerVolunteer(VolunteerRegistrationDto dto) {
        if (myUserRepository.existsByUsername(dto.getUsername())) {
            return ResponseEntity.badRequest().body("Username already taken. Please choose another one.");
        }

        if (myUserRepository.existsByEmail(dto.getEmail())) {
            return ResponseEntity.badRequest().body("Email already registered. Please choose another one.");
        }

        Volunteer volunteer = new Volunteer();
        volunteer.setUsername(dto.getUsername());
        volunteer.setPassword(passwordEncoder.encode(dto.getPassword()));
        volunteer.setFirstName(dto.getFirstName());
        volunteer.setLastName(dto.getLastName());
        volunteer.setEmail(dto.getEmail());
        volunteer.setDateOfBirth(dto.getDateOfBirth());
        volunteer.setRole(Role.VOLUNTEER);
        volunteer.setContactNumber(dto.getContactNumber());
        volunteer.setExpertise(dto.getExpertise());
        volunteer.setVerified(false);
        String verificationToken = UUID.randomUUID().toString();
        System.out.println(verificationToken);
        volunteer.setVerificationToken(verificationToken);
        emailService.sendVerificationEmail(dto.getEmail(), verificationToken);

        volunteerRepository.save(volunteer);

        return ResponseEntity.ok("Volunteer registered successfully.");
    }

    public ResponseEntity<?> registerGoogleVolunteer(String email) throws IOException {
        Optional<GoogleUser> u = googleUserRepository.findByEmail(email);

        if (u.isPresent()) {
            GoogleUser googleUser = u.get();

            Volunteer volunteer = new Volunteer();
            volunteer.setUsername(googleUser.getEmail());
            volunteer.setPassword("oauth2");
            volunteer.setFirstName(googleUser.getFirst_name());
            volunteer.setLastName(googleUser.getLast_name());
            volunteer.setEmail(googleUser.getEmail());
            volunteer.setRole(Role.VOLUNTEER);
            volunteer.setVerified(false);
            volunteer.setContactNumber(null);
            volunteer.setExpertise(null);
            String verificationToken = UUID.randomUUID().toString();
            volunteer.setVerificationToken(verificationToken);
            emailService.sendVerificationEmail(googleUser.getEmail(), verificationToken);

            System.out.println("kreiran volonter");
            System.out.println(volunteer);

            volunteerRepository.save(volunteer);

            UserDetails userdetails = myUserDetailsService.loadUserByUsername(volunteer.getUsername());

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
//            System.out.println("redirectUrl: " + redirectUrl);
            // Vraća JWT token u odgovoru
            Map<String, String> response = new HashMap<>();
            response.put("jwt", token);
            response.put("role", role);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed");
    }
    
    public ResponseEntity<Object> saveReview(Integer reviewID, ReviewDto dto, Long volunteerID) {
    	try {
    		Review review = new Review();
        	review.setRating(dto.getRating());
        	review.setComment(dto.getComment());
        	review.setProjectID(reviewID);
        	review.setReviewDate(LocalDate.now());
        	review.setVolunteerID(volunteerID);
        	reviewRepository.save(review);
        	return ResponseEntity.ok("Review published successfully");
    	} catch(Exception e) {
    		return ResponseEntity.badRequest().body(e);
    	}
    }
}
