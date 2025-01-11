package com.example.backend.service;

import com.example.backend.dto.ProjectResponseDto;
import com.example.backend.dto.VolunteerProjectDto;
import com.example.backend.model.*;
import com.example.backend.repository.ApplicationRepository;
import com.example.backend.repository.OrganizationRepository;
import com.example.backend.repository.ProjectRepository;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProjectService {
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    public List<ProjectResponseDto> getAllProjects() {
        List<Project> projects = projectRepository.findAll();
        List<ProjectResponseDto> responseList = new ArrayList<>();

        for (Project project : projects) {
            ProjectResponseDto dto = new ProjectResponseDto();
            dto.setProjectname(project.getProjectName());
            dto.setProjectdesc(project.getProjectDesc());
            dto.setTypeofwork(project.getTypeOfWork());
            dto.setBeginningdate(project.getStartDate());
            dto.setEnddate(project.getEndDate());
            dto.setProjectlocation(project.getLocation());
            dto.setNumregisteredvolunteers(project.getNumVolunteers());
            dto.setMaxnumvolunteers(project.getMaxNumVolunteers());

            LocalDate currentDate = LocalDate.now();
            if (dto.getBeginningdate().isAfter(currentDate)){
                dto.setStatus(String.valueOf(Status.OPEN));
            } else if(currentDate.isAfter(dto.getEnddate())){
                dto.setStatus(String.valueOf(Status.CLOSED));
            } else if ((currentDate.isEqual(dto.getBeginningdate()) || currentDate.isAfter(dto.getBeginningdate())) &&
                    (currentDate.isEqual(dto.getEnddate()) || currentDate.isBefore(dto.getEnddate()))) {
                dto.setStatus(String.valueOf(Status.IN_PROGRESS));
            }else{
                dto.setStatus(String.valueOf(Status.CLOSED));
            }

            dto.setProjectID(project.getProjectId());
            dto.setUrgent(project.getUrgent());

            // Fetch the organization name using the organization ID
            Organization organization = organizationRepository.findById(project.getOrganizationID())
                    .orElseThrow(() -> new RuntimeException("Organization not found"));
            dto.setOrganizationName(organization.getOrganizationName());
            dto.setOrganizationID(organization.getId());
            dto.setOrganizationEmail(organization.getEmail());

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
            responseDto.setTypeofwork(project.getTypeOfWork());
            responseDto.setBeginningdate(project.getStartDate());
            responseDto.setEnddate(project.getEndDate());
            responseDto.setProjectlocation(project.getLocation());
            responseDto.setNumregisteredvolunteers(project.getNumVolunteers());
            responseDto.setMaxnumvolunteers(project.getMaxNumVolunteers());

            LocalDate currentDate = LocalDate.now();
            if (responseDto.getBeginningdate().isAfter(currentDate)){
                responseDto.setStatus(String.valueOf(Status.OPEN));
            } else if(currentDate.isAfter(responseDto.getEnddate())){
                responseDto.setStatus(String.valueOf(Status.CLOSED));
            } else if ((currentDate.isEqual(responseDto.getBeginningdate()) || currentDate.isAfter(responseDto.getBeginningdate())) &&
                    (currentDate.isEqual(responseDto.getEnddate()) || currentDate.isBefore(responseDto.getEnddate()))) {
                responseDto.setStatus(String.valueOf(Status.IN_PROGRESS));
            }else{
                responseDto.setStatus(String.valueOf(Status.CLOSED));
            }

            responseDto.setProjectID(project.getProjectId());
            responseDto.setUrgent(project.getUrgent());
            responseDto.setOrganizationName(organization.getOrganizationName()); // Set the organization name
            responseDto.setOrganizationID(organization.getId());

            responseList.add(responseDto);
        }
        return responseList;
    }

    public ProjectResponseDto getSpecificProject(Long projectId){
        ProjectResponseDto dto = new ProjectResponseDto();
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new RuntimeException("Project not found"));

        dto.setProjectname(project.getProjectName());
        dto.setBeginningdate(project.getStartDate());
        dto.setEnddate(project.getEndDate());
        dto.setProjectlocation(project.getLocation());
        dto.setProjectdesc(project.getProjectDesc());
        dto.setMaxnumvolunteers(project.getMaxNumVolunteers());
        dto.setUrgent(project.getUrgent());
        dto.setOrganizationID(project.getOrganizationID());

        Organization organization = organizationRepository.findById(project.getOrganizationID()).get();
        System.out.println(organization.toString());
        System.out.println(organization.getOrganizationName());

        dto.setOrganizationName(organization.getOrganizationName());
        dto.setOrganizationEmail(organization.getEmail());
        dto.setTypeofwork(project.getTypeOfWork());

        LocalDate currentDate = LocalDate.now();
        if (dto.getBeginningdate().isAfter(currentDate)){
            dto.setStatus(String.valueOf(Status.OPEN));
        } else if(currentDate.isAfter(dto.getEnddate())){
            dto.setStatus(String.valueOf(Status.CLOSED));
        } else if ((currentDate.isEqual(dto.getBeginningdate()) || currentDate.isAfter(dto.getBeginningdate())) &&
                (currentDate.isEqual(dto.getEnddate()) || currentDate.isBefore(dto.getEnddate()))) {
            dto.setStatus(String.valueOf(Status.IN_PROGRESS));
        }else{
            dto.setStatus(String.valueOf(Status.CLOSED));
        }

        return dto;
    }

    public VolunteerProjectDto get_project_info_as_volunteer(Long volunteerId, Long projectId){
        VolunteerProjectDto dto = new VolunteerProjectDto();

        ProjectResponseDto dto0 = getSpecificProject(projectId);

        dto.setBeginningdate(dto0.getBeginningdate());
        dto.setEnddate(dto0.getEnddate());
        dto.setMaxnumvolunteers(dto0.getMaxnumvolunteers());
        dto.setNumregisteredvolunteers(dto0.getNumregisteredvolunteers());
        dto.setOrganizationEmail(dto0.getOrganizationEmail());
        dto.setOrganizationID(dto0.getOrganizationID());
        dto.setOrganizationName(dto0.getOrganizationName());
        dto.setTypeofwork(dto0.getTypeofwork());
        dto.setStatus(dto0.getStatus());
        dto.setProjectlocation(dto0.getProjectlocation());
        dto.setUrgent(dto0.isUrgent());
        dto.setProjectname(dto0.getProjectname());
        dto.setProjectdesc(dto0.getProjectdesc());
        dto.setProjectID(dto0.getProjectID());

        List<Application> applications = applicationRepository.findAllByProjectId(projectId);
        List<Long> ids = applications.stream().map(Application::getVolunteerId).toList();

        if (ids.contains(volunteerId)){
            dto.setHasApplied(true);
        }else{
            dto.setHasApplied(false);
        }

        return dto;
    }

    public String edit_project(ProjectResponseDto dto){
        Long projectId = dto.getProjectID();
        Project project = projectRepository.findById(projectId).get();

        // edit project
        project.setProjectName(dto.getProjectname());
        project.setProjectDesc(dto.getProjectdesc());
        project.setTypeOfWork(dto.getTypeofwork());
        project.setStartDate(dto.getBeginningdate());
        project.setEndDate(dto.getEnddate());
        project.setLocation(dto.getProjectlocation());
        project.setMaxNumVolunteers(dto.getMaxnumvolunteers());
        project.setUrgent(dto.isUrgent());

        projectRepository.save(project);

        return project.toString();
    }
}
