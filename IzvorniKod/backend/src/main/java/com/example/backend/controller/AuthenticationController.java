package com.example.backend.controller;

import com.example.backend.dto.*;
import com.example.backend.model.Image;
import com.example.backend.model.Project;
import com.example.backend.repository.MyUserRepository;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.security.JwtService;
import com.example.backend.security.MyUserDetailsService;
import com.example.backend.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "https://volontirajsnama.onrender.com"})
public class AuthenticationController {
	
	@Autowired
	private ProjectRepository projectrepository;
	
	@Autowired
	private MyUserRepository myUserRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private MyUserDetailsService myUserDetailsService;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private OrganizationService organizationService;

    @Autowired
    private ImageService imageService;
    
    @Autowired 
    private FilteringService filteringService;
    @Autowired
    private VolunteerService volunteerService;


    // anonimni homepage
    @GetMapping("/home")
    public List<ProjectResponseDto> home() {
        return projectService.getAllProjects();
    }

    // sve aktivnosti
    @GetMapping("/home/activities")
    public List<ProjectResponseDto> activities() {
        return projectService.getAllProjects();
    }

    // specifican projekt
    @GetMapping("/home/activity/{projectId}")
    public ProjectResponseDto specific(@PathVariable Long projectId) {
        return projectService.getSpecificProject(projectId);
    }
    
    //filtrirani projekti
    @PostMapping("/home/activities/filter")
    public List<ProjectResponseDto> filtered_activities(@RequestBody ProjectFilteringRequestDto projectFilteringRequestDto) {
    	return projectService.filter_projects(projectFilteringRequestDto);
    }

    // dohvacanje slike projekta
    @GetMapping("/home/project-picture/{projectId}")
    public ResponseEntity<byte[]> get_picture(@PathVariable Long projectId) {
        return projectService.get_project_picture(projectId);
    }

    // slika specificne organizacije
    @GetMapping("/home/organization/profile-picture/{organizationId}")
    public ResponseEntity<byte[]> get_picture_organization(@PathVariable Long organizationId) {
        return organizationService.get_picture_specific_org(organizationId);
    }

    // slika specificnog volontera
    @GetMapping("/home/volunteer/profile-picture/{volunteerId}")
    public ResponseEntity<byte[]> get_picture_volunteer(@PathVariable Long volunteerId) {
        return volunteerService.get_picture_specific_vol(volunteerId);
    }

    // sve organizacija
    @GetMapping("/home/organizations")
    public List<OrganizationProfileDto> organizations() {
        return organizationService.getAllOrganizations();
    }

    // some organization profile info
    @GetMapping("/home/profile/{organizationId}")
    public OrganizationProfileDto get_profile_info(@PathVariable Long organizationId) {
        return organizationService.get_profile_info(organizationId);
    }

    // some volunteer profile info
    @GetMapping("/home/profile-vol/{volunteerId}")
    public VolunteerProfileDto get_vol_profile_info(@PathVariable Long volunteerId) {
        return volunteerService.get_profile_info(volunteerId);
    }

    // prethodne volonterove aktivnosti (na koje je prihvacen)
    @GetMapping("/home/volunteer/previous-activities/{volunteerId}")
    public List<VolunteerProjectProfileDto> get_prev_projects (@PathVariable Long volunteerId){
        return volunteerService.previous_projects(volunteerId);
    }

    // trenutne volonterove aktivnosti koje su in_progress, a na njih je prihvacen
    @GetMapping("/home/volunteer/in-progress-activities/{volunteerId}")
    public List<VolunteerProjectProfileDto> get_in_progress_projects (@PathVariable Long volunteerId){
        return volunteerService.in_progress_projects(volunteerId);
    }


    // login
    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticateAndGetToken(@RequestBody LoginDto loginDto) {
        try {
            // Provodi autentifikaciju
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword())
            );
            
            // Ako je autentifikacija uspješna, provjerimo je li korisnik verificiran
            if (!myUserRepository.findByUsername(loginDto.getUsername()).get().isVerified()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "verification needed");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }

            // Ako je korisnik verificiran, generiramo JWT token
            if (authentication.isAuthenticated()) {
                String token = jwtService.generateToken(myUserDetailsService.loadUserByUsername(loginDto.getUsername()));

                String role = authentication.getAuthorities().stream()
                        .map(grantedAuthority -> grantedAuthority.getAuthority())
                        .findFirst()
                        .orElse("ROLE_USER");

                // Vraća JWT token u odgovoru
                Map<String, String> response = new HashMap<>();
                response.put("jwt", token);
                response.put("role", role);
                return ResponseEntity.ok(response);
            } else {
                // Ovo neće biti izvršeno jer je autentifikacija provjerena prije
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed");
            }

        } catch (Exception e) {
            // Ako je autentifikacija neuspješna, vraća odgovarajuću poruku o grešci
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Invalid username or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

}