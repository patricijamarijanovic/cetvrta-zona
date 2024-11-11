package com.example.backend.controller;

import com.example.backend.model.Prijava;
import com.example.backend.model.Project;
import com.example.backend.repository.MyUserRepository;
import com.example.backend.repository.PrijavaRepository;
import com.example.backend.repository.ProjectRepository;
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
    private PrijavaRepository prijavaRepository;

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

}
