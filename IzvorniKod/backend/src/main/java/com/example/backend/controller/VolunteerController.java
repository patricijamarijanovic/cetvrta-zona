package com.example.backend.controller;

import com.example.backend.dto.*;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import com.example.backend.service.ComplaintService;
import com.example.backend.service.ImageService;
import com.example.backend.service.ProjectService;
import com.example.backend.service.VolunteerService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "https://volontirajsnama.onrender.com"})
public class VolunteerController {

    @Autowired
    private VolunteerService volunteerService;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private VolunteerRepository volunteerRepository;

    @Autowired
    private ImageService imageService;
    
    @Autowired
    private MyUserRepository myUserRepository;

    @Autowired
    private ComplaintService complaintService;

    // volonterski homepage
    @GetMapping("/volunteer/home")
    public List<ProjectResponseDto> volunteer_home() {
        return projectService.getAllProjects();
    }

    //posalji prituzbu kao volonter
    @PostMapping("/volunteer/send-complaint")
    public String send_complaint_registered(@RequestBody SentComplaintRegisteredDto dto) {
        return complaintService.send_complaint_vol(dto);
    }

    // svi moguci projekti
    @GetMapping("/volunteer/activities")
    public List<ProjectResponseDto> all_activities() {
        return projectService.getAllProjects();
    }
    
    // filtrirani projekti
    @PostMapping("/volunteer/activities/filter")
    public List<ProjectResponseDto> filtered_activities(@RequestBody ProjectFilteringRequestDto projectFilteringRequestDto) {
    	return projectService.filter_projects(projectFilteringRequestDto);
    }

    // my profile info
    @GetMapping("/volunteer/my-profile")
    public VolunteerProfileDto my_profile() {
        return volunteerService.my_profile_info();
    }

    // my profile picture
    @GetMapping("/volunteer/profile-picture")
    public ResponseEntity<byte[]> get_picture() {
        return volunteerService.get_profile_picture();
    }

    // prijava na projekt
    @PostMapping("/volunteer/apply/{projectID}")
    public String apply_for_project (@PathVariable Long projectID){
        return volunteerService.application(projectID);
    }

    // uredivanje profila
    @PostMapping("/volunteer/edit-profile")
    public String edit (@RequestBody VolunteerProfileDto dto){
        return volunteerService.edit_profile(dto);
    }

    // uredivanje slike profila
    @PostMapping("/volunteer/edit-picture")
    public Long uploadImage(@RequestParam("image") MultipartFile file) throws IOException {
        return imageService.saveProfileImageVol(file);
    }

    // dohvati specificni projekt
    @GetMapping("/volunteer/activity/{projectId}")
    public VolunteerProjectDto get_project_info (@PathVariable Long projectId){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Volunteer vol = volunteerRepository.findByUsername(username);

        return projectService.get_project_info_as_volunteer(vol.getId(), projectId);
    }


    // prethodne aktivnosti (na koje je prihvacen)
    @GetMapping("/volunteer/previous-activities")
    public List<VolunteerProjectProfileDto> get_prev_projects (){
        return volunteerService.my_previous_projects();
    }

    // aktivnosti koje su in_progress, a na njih je prihvacen
    @GetMapping("/volunteer/in-progress-activities")
    public List<VolunteerProjectProfileDto> get_in_progress_projects (){
        return volunteerService.my_in_progress_projects();
    }

    // buduce aktivnosti na koje je prihvacen
    @GetMapping("/volunteer/future-activities")
    public List<VolunteerProjectProfileDto> get_future_projects (){
        return volunteerService.future_accepted_projects();
    }

    // aktivnosti na koje ceka odgovor (buduce ili in progress)
    @GetMapping("/volunteer/pending-activities")
    public List<VolunteerProjectProfileDto> get_pending_projects (){
        return volunteerService.waits_for_response_projects();
    }

    // prijava na newsletter
    @PostMapping("/volunteer/newsletter/{organizationId}")
    public String subscribe_newsletter (@PathVariable Long organizationId){
        return volunteerService.subscribe(organizationId);
    }

    // odjava s newslettera
    @PostMapping("/volunteer/unsubscribe/{organizationId}")
    public String unsubscribe_newsletter (@PathVariable Long organizationId){
        return volunteerService.unsubscribe(organizationId);
    }

    // je li prijavljen na newsletter
    @GetMapping("/volunteer/is-subscribed/{organizationId}")
    public boolean is_subscribed (@PathVariable Long organizationId){
        return volunteerService.is_subscribed(organizationId);
    }
    
    //objavljivanje recenzije na projekt 
    @PostMapping("/volunteer/activity/{projectID}")
    public ResponseEntity<Object> leave_review (@PathVariable Integer projectID, @RequestBody ReviewDto dto) {
    	Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    	MyUser prijavljeniVolonter = myUserRepository.findByUsername(authentication.getName()).get();
    	return volunteerService.saveReview(projectID, dto, prijavljeniVolonter.getId());
    }
}
