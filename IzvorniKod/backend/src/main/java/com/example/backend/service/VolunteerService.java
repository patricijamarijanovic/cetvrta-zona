package com.example.backend.service;

import com.example.backend.dto.VolunteerRegistrationDto;
import com.example.backend.model.Role;
import com.example.backend.model.Volunteer;
import com.example.backend.repository.VolunteerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class VolunteerService {
    @Autowired
    private VolunteerRepository volunteerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Volunteer registerVolunteer(VolunteerRegistrationDto dto) {
        Volunteer volunteer = new Volunteer();
        volunteer.setUsername(dto.getUsername());
        volunteer.setPassword(passwordEncoder.encode(dto.getPassword()));
        volunteer.setFirstName(dto.getFirstName());
        volunteer.setLastName(dto.getLastName());
        volunteer.setEmail(dto.getEmail());
        volunteer.setDateOfBirth(dto.getDateOfBirth());
        volunteer.setRole(Role.VOLUNTEER);
        return volunteerRepository.save(volunteer);
    }
}
