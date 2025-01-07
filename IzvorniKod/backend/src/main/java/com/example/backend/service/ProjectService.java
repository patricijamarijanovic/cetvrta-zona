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
            dto.setProjectname(project.getProjectName());
            dto.setProjectdesc(project.getProjectDesc());
            dto.setTypeofwork(String.valueOf(project.getTypeOfWork()));
            dto.setBeginningdate(project.getStartDate());
            dto.setEnddate(project.getEndDate());
            dto.setProjectlocation(project.getLocation());
            dto.setNumregisteredvolunteers(project.getNumVolunteers());
            dto.setMaxnumvolunteers(project.getMaxNumVolunteers());
            dto.setStatus(String.valueOf(project.getStatus()));
            dto.setProjectID(project.getProjectId());
            dto.setUrgent(project.getUrgent());

            // Fetch the organization name using the organization ID
            Organization organization = organizationRepository.findById(project.getOrganizationID())
                    .orElseThrow(() -> new RuntimeException("Organization not found"));
            dto.setOrganizationName(organization.getOrganizationName());
            dto.setOrganizationID(organization.getId());

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
            responseDto.setProjectname(project.getProjectName());
            responseDto.setProjectdesc(project.getProjectDesc());
            responseDto.setTypeofwork(String.valueOf(project.getTypeOfWork()));
            responseDto.setBeginningdate(project.getStartDate());
            responseDto.setEnddate(project.getEndDate());
            responseDto.setProjectlocation(project.getLocation());
            responseDto.setNumregisteredvolunteers(project.getNumVolunteers());
            responseDto.setMaxnumvolunteers(project.getMaxNumVolunteers());
            responseDto.setStatus(String.valueOf(project.getStatus()));
            responseDto.setProjectID(project.getProjectId());
            responseDto.setUrgent(project.getUrgent());
            responseDto.setOrganizationName(organization.getOrganizationName()); // Set the organization name
            responseDto.setOrganizationID(organization.getId());

            responseList.add(responseDto);
        }
        return responseList;
    }
}
