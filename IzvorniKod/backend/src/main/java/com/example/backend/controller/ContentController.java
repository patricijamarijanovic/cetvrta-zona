package com.example.backend.controller;

import com.example.backend.dto.LoginDto;
import com.example.backend.model.MyUser;
import com.example.backend.model.Prijava;
import com.example.backend.model.Project;
import com.example.backend.repository.MyUserRepository;
import com.example.backend.repository.PrijavaRepository;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.security.JwtService;
import com.example.backend.security.MyUserDetailsService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.net.ssl.SSLEngineResult.Status;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ContentController {
	
	@Autowired
	private ProjectRepository projectrepository;
	
	@Autowired
	private MyUserRepository myUserRepository;
	
	@Autowired
	private PrijavaRepository prijavaRepository;
	
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private MyUserDetailsService myUserDetailsService;

    @GetMapping("/home")
    public List<Project> home() {
    	return projectrepository.findAll();
    }

    @GetMapping("/volunteer/home")
    public List<Project> volunteer_home() {
    	return projectrepository.findAll();
    }
    
    @GetMapping("/volunteer/mojeprijave")
    public List<Prijava> volunteer_prijave() {
    	Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		MyUser volonter = myUserRepository.findByUsername(authentication.getName()).get();
		return prijavaRepository.findAllByVolunteerID(volonter.getId());
    }
    
    @PutMapping("/volunteer/apply/{projektID}")
    public String apply_for_project (@PathVariable Integer projektID) {
    	try {
    		Project p = projectrepository.findByProjektID(projektID).get();
    		p.prijaviVolontera();
    		projectrepository.save(p);
    		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    		MyUser prijavljeniVolonter = myUserRepository.findByUsername(authentication.getName()).get();
    		Prijava prijava = new Prijava();
    		prijava.setProjektID(projektID);
    		prijava.setDatumprijave(LocalDateTime.now());
    		prijava.setVolunteerID(prijavljeniVolonter.getId());
    		prijava.setStatusprijave("UNDEFINED");
    		prijavaRepository.save(prijava);
    		return "Volonter uspjesno prijavljen!";
    	} catch (Exception e) {
    		System.out.println(e);
    		return "Nije moguce prijaviti volontera jer su mjesta vec popunjena";
    	}
    }

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
    	project.resetBrojprijavljenihvolontera();
    	projectrepository.save(project);
    	return new RedirectView("/organization/home");
    }
    
    @GetMapping("/organization/project/{projektID}/prijave")
    public List<Prijava> pregledaj_prijave_na_projekt(@PathVariable Integer projektID) {
    	return prijavaRepository.findAllByProjektID(projektID);
    }
    
    @PutMapping("/organization/project/{projektID}/prijave/{prijavaID}")
    public RedirectView prihvati_prijavu(@PathVariable Integer projektID, @PathVariable Long prijavaID) {
    	Prijava prijava = prijavaRepository.findByPrijavaID(prijavaID).get();
    	prijava.setStatusprijave("PRIHVACENA");
    	prijavaRepository.save(prijava);
    	return new RedirectView("/organization/project/%d/prijave".formatted(projektID));
    }
    
    @DeleteMapping("/organization/project/{projektID}/prijave/{prijavaID}")
    public RedirectView odbij_prijavu(@PathVariable Integer projektID, @PathVariable Long prijavaID) {
    	Prijava prijava = prijavaRepository.findByPrijavaID(prijavaID).get();
    	prijava.setStatusprijave("ODBIJENA");
    	prijavaRepository.save(prijava);
    	Project project = projectrepository.findByProjektID(projektID).get();
    	project.odbijVolontera();
    	projectrepository.save(project);
    	return new RedirectView("/organization/project/%d/prijave".formatted(projektID));
    }

//    @PostMapping("/authenticate")
//    public String authenticateAndGetToken(@RequestBody LoginDto loginDto) {
//        // provjerava jesu li username i password dobri
//        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
//                loginDto.getUsername(),  loginDto.getPassword()
//        ));
//
//        // ako je dobro, vrati token
//        if (authentication.isAuthenticated()){
//            return jwtService.generateToken(myUserDetailsService.loadUserByUsername(loginDto.getUsername()));
//        }else{
//            throw new UsernameNotFoundException("invalid credentials :(");
//        }
//    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticateAndGetToken(@RequestBody LoginDto loginDto) {
        try {
            // Provodi autentifikaciju
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword())
            );

            // Ako je autentifikacija uspješna, generira JWT token
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