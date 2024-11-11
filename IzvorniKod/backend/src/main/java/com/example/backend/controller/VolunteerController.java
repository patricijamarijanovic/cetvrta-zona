package com.example.backend.controller;

import com.example.backend.model.MyUser;
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

import java.time.LocalDateTime;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class VolunteerController {
    @Autowired
    private ProjectRepository projectrepository;

    @Autowired
    private MyUserRepository myUserRepository;

    @Autowired
    private PrijavaRepository prijavaRepository;

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
}
