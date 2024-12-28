package com.example.backend.service;

import com.example.backend.dto.ProjectResponseDto;
import com.example.backend.model.Organization;
import com.example.backend.model.Project;
import com.example.backend.repository.OrganizationRepository;
import com.example.backend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProjectService {
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    public List<ProjectResponseDto> getAllProjects() {
        List<Project> projects = projectRepository.findAll();
        List<ProjectResponseDto> responseList = new ArrayList<>();

        for (Project project : projects) {
            ProjectResponseDto dto = new ProjectResponseDto();
            dto.setProjectname(project.getProjectname());
            dto.setProjectdesc(project.getProjectdesc());
            dto.setTypeofwork(project.getTypeOfWork());
            dto.setBeginningdate(project.getBeginningdate());
            dto.setEnddate(project.getEnddate());
            dto.setProjectlocation(project.getProjectlocation());
            dto.setNumregisteredvolunteers(project.getNumregisteredvolunteers());
            dto.setMaxnumvolunteers(project.getMaxnumvolunteers());
            dto.setStatus(project.getStatus());
            dto.setProjectID(project.getProjectID());
            dto.setUrgent(project.getUrgent());

            // Fetch the organization name using the organization ID
            Organization organization = organizationRepository.findById(project.getOrganizationID())
                    .orElseThrow(() -> new RuntimeException("Organization not found"));
            dto.setOrganizationName(organization.getOrganizationName());

            responseList.add(dto);
        }
        return responseList;
    }

    public List<ProjectResponseDto> getProjectsForOrganization() {
        // Get the currently authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        // Find the organization by the authenticated user's username
        Organization organization = organizationRepository.findByUsername(username);
        if (organization == null) {
            throw new RuntimeException("Organizacija nije pronađena za korisnika: " + username);
        }

        // Fetch all projects for the organization
        List<Project> projects = projectRepository.findAllByOrganizationID(organization.getId());
        List<ProjectResponseDto> responseList = new ArrayList<>();

        // Map each Project to ProjectResponseDto
        for (Project project : projects) {
            ProjectResponseDto responseDto = new ProjectResponseDto();
            responseDto.setProjectname(project.getProjectname());
            responseDto.setProjectdesc(project.getProjectdesc());
            responseDto.setTypeofwork(project.getTypeOfWork());
            responseDto.setBeginningdate(project.getBeginningdate());
            responseDto.setEnddate(project.getEnddate());
            responseDto.setProjectlocation(project.getProjectlocation());
            responseDto.setNumregisteredvolunteers(project.getNumregisteredvolunteers());
            responseDto.setMaxnumvolunteers(project.getMaxnumvolunteers());
            responseDto.setStatus(project.getStatus());
            responseDto.setProjectID(project.getProjectID());
            responseDto.setUrgent(project.getUrgent());
            responseDto.setOrganizationName(organization.getOrganizationName()); // Set the organization name

            responseList.add(responseDto);
        }

        return responseList;
    }
}
