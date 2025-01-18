package com.example.backend.service;

import com.example.backend.dto.ProjectFilteringRequestDto;
import com.example.backend.dto.ProjectResponseDto;
import com.example.backend.dto.VolunteerProjectDto;
import com.example.backend.dto.VolunteerProjectProfileDto;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private ImageService imageService;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private ProjectPictureRepository projectPictureRepository;
    
    @Autowired
    private FilteringService filteringService;

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
        dto.setNumregisteredvolunteers(project.getNumVolunteers());
        dto.setUrgent(project.getUrgent());
        dto.setOrganizationID(project.getOrganizationID());

        Organization organization = organizationRepository.findById(project.getOrganizationID()).get();
        System.out.println(organization.toString());
        System.out.println(organization.getOrganizationName());

        dto.setOrganizationName(organization.getOrganizationName());
        dto.setOrganizationEmail(organization.getEmail());
        dto.setTypeofwork(project.getTypeOfWork());
        dto.setProjectID(project.getProjectId());

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
    
    public List<ProjectResponseDto> filter_projects(ProjectFilteringRequestDto projectFilteringRequestDto) {
    	List<Project> lista = filteringService.filterProjects(projectFilteringRequestDto.getTypeOfWork(), 
    										   projectFilteringRequestDto.getProjectLocation(), 
    										   projectFilteringRequestDto.getStartDate(), 
    										   projectFilteringRequestDto.getEndDate());
    	List<ProjectResponseDto> responseList = new ArrayList<ProjectResponseDto>();
    	for (Project project: lista) {
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

    public VolunteerProjectDto get_project_info_as_volunteer(Long volunteerId, Long projectId){
        VolunteerProjectDto dto = new VolunteerProjectDto();

        ProjectResponseDto dto0 = getSpecificProject(projectId);
        Project project = projectRepository.findById(projectId).get();

        dto.setBeginningdate(project.getStartDate());
        dto.setEnddate(project.getEndDate());
        dto.setMaxnumvolunteers(project.getMaxNumVolunteers());
        dto.setNumvolunteers(project.getNumVolunteers());
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
        dto.setHasParticipated(false);
        dto.setHasApplied(false);
        for (Application application : applications) {
            if (application.getVolunteerId().equals(volunteerId)) {
                dto.setHasApplied(true);
                if (application.getStatus().equals(ApplicationStatus.ACCEPTED)){
                    dto.setHasParticipated(true);
                }
                break;
            }
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

    public Long edit_project_picture(Long projectId, MultipartFile file) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Organization org = organizationRepository.findByUsername(username);

        Optional<ProjectPicture> o = projectPictureRepository.findByProjectId(projectId);
        if (o.isPresent()) {
            ProjectPicture projectPicture = o.get();
            projectPictureRepository.delete(projectPicture);
        }

        Image image = new Image();
        image.setName(file.getOriginalFilename());
        image.setType(file.getContentType());
        image.setData(file.getBytes());
        imageRepository.save(image);

        ProjectPicture op = new ProjectPicture();
        op.setProjectId(projectId);
        op.setImageId(image.getId());
        projectPictureRepository.save(op);
        return image.getId();
    }


    public ResponseEntity<byte[]> get_project_picture(Long projectId){
        Optional<ProjectPicture> o = projectPictureRepository.findByProjectId(projectId);
        if (o.isPresent()) {
            ProjectPicture op = o.get();

            try {
                Image image = imageService.getImage(op.getImageId());
                return ResponseEntity.ok()
                        .header("Content-Type", image.getType())
                        .body(image.getData());
            } catch (Exception e) {
                return ResponseEntity.noContent().build();
            }

        }
        return ResponseEntity.noContent().build();
    }

    public List<VolunteerProjectProfileDto> org_previous_projects(Long organizationId){
        Organization organization = organizationRepository.findById(organizationId).get();

        List<VolunteerProjectProfileDto> lista = new ArrayList<>();
        projectRepository.findAllByOrganizationID(organizationId).forEach(project -> {

            LocalDate currentDate = LocalDate.now();
            if (currentDate.isAfter(project.getEndDate())){
                VolunteerProjectProfileDto dto = new VolunteerProjectProfileDto();
                dto.setProjectID(project.getProjectId());
                dto.setProjectname(project.getProjectName());
                dto.setProjectdesc(project.getProjectDesc());
                dto.setTypeofwork(project.getTypeOfWork());
                dto.setBeginningdate(project.getStartDate());
                dto.setEnddate(project.getEndDate());
                dto.setOrganizationName(organization.getOrganizationName());
                dto.setOrganizationID(organization.getId());
                dto.setProjectlocation(project.getLocation());
                lista.add(dto);
            }

        });

        return lista;
    }

    public List<VolunteerProjectProfileDto> org_in_progress_projects(Long organizationId){
        Organization organization = organizationRepository.findById(organizationId).get();

        List<VolunteerProjectProfileDto> lista = new ArrayList<>();
        projectRepository.findAllByOrganizationID(organizationId).forEach(project -> {

            LocalDate currentDate = LocalDate.now();
            if ((currentDate.isEqual(project.getStartDate()) || currentDate.isAfter(project.getStartDate())) &&
                    (currentDate.isEqual(project.getEndDate()) || currentDate.isBefore(project.getEndDate()))){
                VolunteerProjectProfileDto dto = new VolunteerProjectProfileDto();
                dto.setProjectID(project.getProjectId());
                dto.setProjectname(project.getProjectName());
                dto.setProjectdesc(project.getProjectDesc());
                dto.setTypeofwork(project.getTypeOfWork());
                dto.setBeginningdate(project.getStartDate());
                dto.setEnddate(project.getEndDate());
                dto.setOrganizationName(organization.getOrganizationName());
                dto.setOrganizationID(organization.getId());
                dto.setProjectlocation(project.getLocation());
                lista.add(dto);
            }

        });

        return lista;
    }

    public List<VolunteerProjectProfileDto> org_future_projects(Long organizationId){
        Organization organization = organizationRepository.findById(organizationId).get();

        List<VolunteerProjectProfileDto> lista = new ArrayList<>();
        projectRepository.findAllByOrganizationID(organizationId).forEach(project -> {

            LocalDate currentDate = LocalDate.now();
            if (project.getStartDate().isAfter(currentDate)){
                VolunteerProjectProfileDto dto = new VolunteerProjectProfileDto();
                dto.setProjectID(project.getProjectId());
                dto.setProjectname(project.getProjectName());
                dto.setProjectdesc(project.getProjectDesc());
                dto.setTypeofwork(project.getTypeOfWork());
                dto.setBeginningdate(project.getStartDate());
                dto.setEnddate(project.getEndDate());
                dto.setOrganizationName(organization.getOrganizationName());
                dto.setOrganizationID(organization.getId());
                dto.setProjectlocation(project.getLocation());
                lista.add(dto);
            }
        });

        return lista;
    }

    public List<ProjectResponseDto> get_recent_activities(){
        List<ProjectResponseDto> lista = new ArrayList<>();
        projectRepository.findAll().forEach(project -> {

            LocalDate currentDate = LocalDate.now();
            if (!currentDate.isAfter(project.getEndDate())){
                ProjectResponseDto dto = new ProjectResponseDto();
                dto.setProjectID(project.getProjectId());
                dto.setProjectname(project.getProjectName());
                dto.setProjectdesc(project.getProjectDesc());
                dto.setTypeofwork(project.getTypeOfWork());
                dto.setBeginningdate(project.getStartDate());
                dto.setEnddate(project.getEndDate());
                dto.setProjectlocation(project.getLocation());
                dto.setNumregisteredvolunteers(project.getNumVolunteers());
                dto.setMaxnumvolunteers(project.getMaxNumVolunteers());


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
                dto.setOrganizationID(project.getOrganizationID());

                Organization organization = organizationRepository.findById(project.getOrganizationID()).get();
                System.out.println(organization.toString());
                System.out.println(organization.getOrganizationName());

                dto.setOrganizationName(organization.getOrganizationName());
                dto.setOrganizationEmail(organization.getEmail());
                if (lista.size() < 6){
                    lista.add(dto);
                }
            }
        });

        return lista;
    }
}
