package com.example.backend.controller;

import com.example.backend.dto.*;
import com.example.backend.model.Project;
import com.example.backend.model.Registration;
import com.example.backend.repository.MyUserRepository;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.repository.RegistrationRepository;
import com.example.backend.security.JwtService;
import com.example.backend.security.MyUserDetailsService;
import com.example.backend.service.ImageService;
import com.example.backend.service.OrganizationService;
import com.example.backend.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.view.RedirectView;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "https://volontirajsnama.onrender.com"})
public class OrganizationController {

    @Autowired
    private OrganizationService organizationService;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private ImageService imageService;

    // projekti te organizacije
    @GetMapping("/organization/home")
    public List<ProjectResponseDto> organization_home() {
        return projectService.getProjectsForOrganization();
    }

    @GetMapping("/organization/createproject")
    public String create_project() {
        return "Form for an organization to create a new project";
    }

    // stvaranje projekta
    @PostMapping("/organization/createproject")
    public Long save_project(@RequestBody ProjectDto dto) {
        return organizationService.createproject(dto);
    }

    // sve prijave na pojedini projekt
    @GetMapping("/organization/applications/{projectId}")
    public List<AppliedVolunteersDto> applications(@PathVariable Long projectId) {
        return organizationService.applications(projectId);
    }

    // potvrdivanje volontera
    @PutMapping("/organization/applications/{projectId}/accept/{volunteerId}")
    public String accept(@PathVariable Long projectId, @PathVariable Long volunteerId) {
        return organizationService.accept(projectId, volunteerId);
    }

    // odbijanje volontera
    @PutMapping("/organization/applications/{projectId}/reject/{volunteerId}")
    public String reject(@PathVariable Long projectId, @PathVariable Long volunteerId) {
        return organizationService.reject(projectId, volunteerId);
    }

    // my profile info
    @GetMapping("/organization/my-profile")
    public OrganizationProfileDto my_profile() {
        return organizationService.my_profile_info();
    }

    // my profile picture
    @GetMapping("/organization/profile-picture")
    public ResponseEntity<byte[]> get_picture() {
        return organizationService.get_profile_picture();
    }

    // some profile info
    @GetMapping("/organization/profile/{organizationId}")
    public OrganizationProfileDto get_profile_info(@PathVariable Long organizationId) {
        return organizationService.get_profile_info(organizationId);
    }

    // uredivanje profila
    @PostMapping("/organization/edit-profile")
    public String edit (@RequestBody OrganizationProfileDto dto){
        return organizationService.edit_profile(dto);
    }

    // uredivanje slike profila
    @PostMapping("/organization/edit-picture")
    public Long uploadImage(@RequestParam("image") MultipartFile file) throws IOException {
        return imageService.saveProfileImageOrg(file);
    }

    // uredivanje projekta
    @PostMapping("/organization/edit-project")
    public String edit_project (@RequestBody ProjectResponseDto dto){
        return projectService.edit_project(dto);
    }

    // uredivanje slike projekta
    @PostMapping("/organization/edit-project-picture/{projectId}")
    public Long edit_project_picture(@RequestParam("image") MultipartFile file, @PathVariable Long projectId) throws IOException {
        return projectService.edit_project_picture(projectId, file);
    }
    
    // odgovor na recenziju
    @PostMapping("/organization/{projectId}")
    public ResponseEntity<Object> leave_response(@RequestBody ReviewResponseDto reviewResponseDto) {
        return organizationService.leave_response(reviewResponseDto);
    }


//    @GetMapping("/organization/project/{projectID}/registrations")
//    public List<Registration> view_project_registrations(@PathVariable Integer projectID) {
//        return registrationRepository.findAllByProjectID(projectID);
//    }

//    @PutMapping("/organization/project/{projectID}/registrations/{registrationID}")
//    public RedirectView accept_registration(@PathVariable Integer projectID, @PathVariable Long registrationID) {
//    	Registration registration = registrationRepository.findByRegistrationID(registrationID).get();
//    	registration.setRegistrationStatus("ACCEPTED");
//        registrationRepository.save(registration);
//        return new RedirectView("/organization/project/%d/registrations".formatted(projectID));
//    }
//
//    @DeleteMapping("/organization/project/{projectID}/registrations/{registrationID}")
//    public RedirectView reject_registration(@PathVariable Integer projectID, @PathVariable Long registrationID) {
//    	Registration registration = registrationRepository.findByRegistrationID(registrationID).get();
//    	registration.setRegistrationStatus("REJECTED");
//        registrationRepository.save(registration);
//        Project project = projectrepository.findByProjectID(projectID).get();
//        project.rejectVolunteer();
//        projectrepository.save(project);
//        return new RedirectView("/organization/project/%d/registrations".formatted(projectID));
//    }

}
