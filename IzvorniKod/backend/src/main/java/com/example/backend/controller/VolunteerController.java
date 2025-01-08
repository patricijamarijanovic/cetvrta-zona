package com.example.backend.controller;

import com.example.backend.dto.ProjectResponseDto;
import com.example.backend.dto.ReviewDto;
import com.example.backend.model.MyUser;
import com.example.backend.model.Project;
import com.example.backend.model.Registration;
import com.example.backend.repository.MyUserRepository;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.repository.RegistrationRepository;
import com.example.backend.security.JwtService;
import com.example.backend.security.MyUserDetailsService;
import com.example.backend.service.ProjectService;
import com.example.backend.service.VolunteerService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "https://volontirajsnama.onrender.com"})
public class VolunteerController {
    @Autowired
    private ProjectRepository projectrepository;

    @Autowired
    private MyUserRepository myUserRepository;

    @Autowired
    private RegistrationRepository registrationRepository;
    
    @Autowired
    private VolunteerService volunteerService;

    @Autowired
    private ProjectService projectService;

    // volonterski homepage
    @GetMapping("/volunteer/home")
    public List<ProjectResponseDto> volunteer_home() {
        return projectService.getAllProjects();
    }

//    @GetMapping("/volunteer/myRegistrations")
//    public List<Registration> volunteer_registrations() {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        MyUser volunteer = myUserRepository.findByUsername(authentication.getName()).get();
//        return registrationRepository.findAllByVolunteerID(volunteer.getId());
//    }

    // svi moguci projekti
    @GetMapping("/volunteer/activities")
    public List<ProjectResponseDto> all_activities() {
        return projectService.getAllProjects();
    }

    // prijava na projekt
    @PostMapping("/volunteer/apply/{projectID}")
    public String apply_for_project (@PathVariable Long projectID){
        return volunteerService.application(projectID);
    }


//    @PostMapping("/volunteer/{projectID}/leavereview")
//    public ResponseEntity<Object> leave_review (@PathVariable Integer projectID, @RequestBody ReviewDto dto) {
//    	Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//    	MyUser prijavljeniVolonter = myUserRepository.findByUsername(authentication.getName()).get();
//    	return volunteerService.saveReview(projectID, dto, prijavljeniVolonter.getId());
//    }
}
