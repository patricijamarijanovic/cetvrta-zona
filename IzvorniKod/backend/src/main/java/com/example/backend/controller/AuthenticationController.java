package com.example.backend.controller;

import com.example.backend.dto.LoginDto;
import com.example.backend.dto.OrganizationProfileDto;
import com.example.backend.dto.ProjectResponseDto;
import com.example.backend.model.Image;
import com.example.backend.repository.MyUserRepository;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.security.JwtService;
import com.example.backend.security.MyUserDetailsService;
import com.example.backend.service.ImageService;
import com.example.backend.service.OrganizationService;
import com.example.backend.service.ProjectService;
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

    @PostMapping("/home/upload")
    public Long uploadImage(@RequestParam("image") MultipartFile file) throws IOException {
        return imageService.saveImage(file);
    }

    // Dohvat slike po ID-u
    @GetMapping("/home/image/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable Long id) {
        try {
            Image image = imageService.getImage(id);
            return ResponseEntity.ok()
                    .header("Content-Type", image.getType())
                    .body(image.getData());
        } catch (Exception e) {
            return ResponseEntity.status(404).body(null);
        }
    }

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

    // sve organizacija
    @GetMapping("/home/organizations")
    public List<OrganizationProfileDto> organizations() {
        return organizationService.getAllOrganizations();
    }

    // some profile info
    @GetMapping("/home/profile/{organizationId}")
    public OrganizationProfileDto get_profile_info(@PathVariable Long organizationId) {
        return organizationService.get_profile_info(organizationId);
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