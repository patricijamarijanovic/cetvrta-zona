package com.example.backend.controller;

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
import org.springframework.web.servlet.view.RedirectView;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class OrganizationController {

    @Autowired
    private ProjectRepository projectrepository;

    @Autowired
    private MyUserRepository myUserRepository;

    @Autowired
    private RegistrationRepository registrationRepository;

    @GetMapping("/organization/home")
    public List<Project> organization_home() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return projectrepository.findAllByOrganizationID(myUserRepository.findByUsername(authentication.getName()).get().getId());
    }

    @GetMapping("/organization/createproject")
    public String create_project() {
        return "Form for an organization to create a new project";
    }

    @PostMapping("/organization/createproject")
    public RedirectView save_project(@RequestBody Project project) {
        project.resetNumRegisteredVolunteers();
        projectrepository.save(project);
        return new RedirectView("/organization/home");
    }

    @GetMapping("/organization/project/{projectID}/registrations")
    public List<Registration> pregledaj_prijave_na_projekt(@PathVariable Integer projectID) {
        return registrationRepository.findAllByProjectID(projectID);
    }

    @PutMapping("/organization/project/{projectID}/registrations/{registrationID}")
    public RedirectView prihvati_prijavu(@PathVariable Integer projectID, @PathVariable Long registrationID) {
    	Registration registration = registrationRepository.findByRegistrationID(registrationID).get();
    	registration.setRegistrationStatus("ACCEPTED");
        registrationRepository.save(registration);
        return new RedirectView("/organization/project/%d/registrations".formatted(projectID));
    }

    @DeleteMapping("/organization/project/{projectID}/registrations/{registrationID}")
    public RedirectView odbij_prijavu(@PathVariable Integer projectID, @PathVariable Long registrationID) {
    	Registration registration = registrationRepository.findByRegistrationID(registrationID).get();
    	registration.setRegistrationStatus("REJECTED");
        registrationRepository.save(registration);
        Project project = projectrepository.findByProjectID(projectID).get();
        project.rejectVolunteer();
        projectrepository.save(project);
        return new RedirectView("/organization/project/%d/registrations".formatted(projectID));
    }

}
