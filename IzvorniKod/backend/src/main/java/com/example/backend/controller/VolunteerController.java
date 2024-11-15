package com.example.backend.controller;

import com.example.backend.model.MyUser;
import com.example.backend.model.Project;
import com.example.backend.model.Registration;
import com.example.backend.repository.MyUserRepository;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.repository.RegistrationRepository;
import com.example.backend.security.JwtService;
import com.example.backend.security.MyUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "https://volontirajsnama.onrender.com:80"})
public class VolunteerController {
    @Autowired
    private ProjectRepository projectrepository;

    @Autowired
    private MyUserRepository myUserRepository;

    @Autowired

    private RegistrationRepository registrationRepository;

    @GetMapping("/volunteer/home")
    public List<Project> volunteer_home() {
        return projectrepository.findAll();
    }

    @GetMapping("/volunteer/myRegistrations")
    public List<Registration> volunteer_registrations() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        MyUser volunteer = myUserRepository.findByUsername(authentication.getName()).get();
        return registrationRepository.findAllByVolunteerID(volunteer.getId());
    }

    @PutMapping("/volunteer/apply/{projectID}")
    public String apply_for_project (@PathVariable Integer projectID) {
        try {
            Project p = projectrepository.findByProjectID(projectID).get();
            p.registerVolunteer();
            projectrepository.save(p);
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            MyUser prijavljeniVolonter = myUserRepository.findByUsername(authentication.getName()).get();
            Registration registration = new Registration();
            registration.setProjectID(projectID);
            registration.setRegistrationDate(LocalDateTime.now());
            registration.setVolunteerID(prijavljeniVolonter.getId());
            registration.setRegistrationStatus("UNDEFINED");
            registrationRepository.save(registration);
            return "Volunteer successfully registered to project!!";
        } catch (Exception e) {
            System.out.println(e);
            return "Can't register volunteer to project because the limit has been reached";
        }
    }
}
