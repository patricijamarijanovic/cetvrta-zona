package com.example.backend.service;

import com.example.backend.dto.ReviewDto;
import com.example.backend.dto.VolunteerProfileDto;
import com.example.backend.dto.VolunteerRegistrationDto;
import com.example.backend.model.*;
import com.example.backend.repository.*;
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
import java.time.LocalDate;
import java.util.*;

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

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private SkillsRepository skillsRepository;

    @Autowired
    private InterestsRepository interestsRepository;


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
        volunteer.setVerified(false);
        String verificationToken = UUID.randomUUID().toString();
        //System.out.println(verificationToken);
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
            volunteer.setVerified(true);
            volunteer.setContactNumber(null);

            String verificationToken = UUID.randomUUID().toString();
            volunteer.setVerificationToken(verificationToken);

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

    public String application(Long projectId){
        // Get the currently authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Volunteer volunteer = volunteerRepository.findByUsername(username);

        Application application = new Application();
        application.setVolunteerId(volunteer.getId());
        application.setProjectId(projectId);
        application.setStatus(ApplicationStatus.PENDING);
        System.out.println(application);

        applicationRepository.save(application);

        Project project = projectRepository.findById(projectId).get();
        Organization organization = organizationRepository.findById(project.getOrganizationID()).get();

        String email = organization.getEmail();
        String poruka = "Korisnik " + volunteer.getFirstName() + " " + volunteer.getLastName()
                + " želi se prijaviti na tvoj projekt: " + project.getProjectName();
        emailService.sendEmail(email, "nova prijava na projekt! 💌", poruka);

        return application.toString();
    }

    public String edit_profile(VolunteerProfileDto dto){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Volunteer og = volunteerRepository.findByUsername(username);

        og.setContactNumber(dto.getPhone());
        og.setLocation(dto.getLocation());
        og.setFirstName(dto.getFirstName());
        og.setLastName(dto.getLastName());
        og.setDateOfBirth(dto.getDateOfBirth());

        System.out.println("ažurirani volonter " + og.toString());
        volunteerRepository.save(og);

        //skills
        System.out.println(dto.getSkills());
        for (Skill s : dto.getSkills()) {
            VolunteerSkills vs = new VolunteerSkills();
            vs.setSkill(s);
            vs.setVolunteerId(og.getId());
            skillsRepository.save(vs);
        }

        //interests
        System.out.println(dto.getInterests());
        for (TypeOfWork i : dto.getInterests()) {
            VolunteerInterests vi = new VolunteerInterests();
            vi.setInterest(i);
            vi.setVolunteerId(og.getId());
            interestsRepository.save(vi);
        }
        return og.toString();
    }

    public VolunteerProfileDto my_profile_info(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Volunteer og = volunteerRepository.findByUsername(username);

        return get_profile_info(og.getId());
    }

    public VolunteerProfileDto get_profile_info(Long volunteerId){
        Volunteer v = volunteerRepository.findById(volunteerId).get();

        VolunteerProfileDto dto = new VolunteerProfileDto();
        dto.setFirstName(v.getFirstName());
        dto.setLastName(v.getLastName());
        dto.setDateOfBirth(v.getDateOfBirth());
        dto.setLocation(v.getLocation());
        dto.setPhone(v.getContactNumber());
        dto.setEmail(v.getEmail());

        List<TypeOfWork> interests = new ArrayList<>();
        List<Skill> skills = new ArrayList<>();

        for (VolunteerSkills vs : skillsRepository.findAllByVolunteerId(volunteerId)) {
            skills.add(vs.getSkill());
        }

        for (VolunteerInterests vi : interestsRepository.findAllByVolunteerId(volunteerId)) {
            interests.add(vi.getInterest());
        }

        dto.setInterests(interests);
        dto.setSkills(skills);

        return dto;
    }
}
