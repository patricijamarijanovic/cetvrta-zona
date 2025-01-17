package com.example.backend.service;

import com.example.backend.dto.*;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import com.example.backend.security.JwtService;
import com.example.backend.security.MyUserDetailsService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.lang.reflect.Type;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

import static com.example.backend.model.Status.OPEN;

@Service
public class OrganizationService {
    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MyUserRepository myUserRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private GoogleUserRepository googleUserRepository;

    @Autowired
    private MyUserDetailsService myUserDetailsService;

    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private EmailService emailService = new EmailService(new JavaMailSenderImpl());

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private VolunteerRepository volunteerRepository;

    @Autowired
    private AreasOrganizationRepository areasOrganizationRepository;

    @Autowired
    private OrganizationPictureRepository organizationPictureRepository;

    @Autowired
    private ImageService imageService;

    @Autowired
    private NewsletterRepository newsletterRepository;
    
    @Autowired
    private ReviewResponseRepository reviewResponseRepository;

    public ResponseEntity<String> registerOrganization(OrganizationRegistrationDto dto) {
        if (myUserRepository.existsByUsername(dto.getUsername())) {
            return ResponseEntity.badRequest().body("Username already taken. Please choose another one.");
        }

        if (myUserRepository.existsByEmail(dto.getEmail())) {
            return ResponseEntity.badRequest().body("Email already registered. Please choose another one.");
        }

        Organization organization = new Organization();
        organization.setOrganizationName(dto.getOrganizationName());
        organization.setEmail(dto.getEmail());
        organization.setPassword(passwordEncoder.encode(dto.getPassword()));
        organization.setUsername(dto.getUsername());
        organization.setRole(Role.ORGANIZATION);
        organization.setVerified(false);
        String verificationToken = UUID.randomUUID().toString();
        organization.setVerificationToken(verificationToken);
        emailService.sendVerificationEmail(dto.getEmail(), verificationToken);

        organizationRepository.save(organization);

        return ResponseEntity.ok("Organization registered successfully.");
    }

    public ResponseEntity<?> registerGoogleOrganization(String email) throws IOException {
        Optional<GoogleUser> u = googleUserRepository.findByEmail(email);

        if (u.isPresent()) {
            GoogleUser googleUser = u.get();

            Organization organization = new Organization();

            organization.setRole(Role.ORGANIZATION);
            organization.setEmail(googleUser.getEmail());
            organization.setOrganizationName(googleUser.getFirst_name() + " " + googleUser.getLast_name());
            organization.setUsername(googleUser.getEmail());
            organization.setPassword("oauth2");
            organization.setVerified(true);
            String verificationToken = UUID.randomUUID().toString();
            organization.setVerificationToken(verificationToken);

            System.out.println("kreirana organizacija");
            System.out.println(organization);
            organizationRepository.save(organization);

            UserDetails userdetails = myUserDetailsService.loadUserByUsername(organization.getUsername());

            System.out.println(userdetails);

            String token = jwtService.generateToken(userdetails);
            System.out.println("token: " + token);

            String role = userdetails.getAuthorities().stream()
                    .map(grantedAuthority -> grantedAuthority.getAuthority())
                    .findFirst()
                    .orElse("ROLE_USER");

            // na ovoj putanji ce se token i uloga pohraniti na localstorage
//            String redirectUrl = "http://localhost:5173/login?token=" + token + "&role=" + role;
////            String redirectUrl = "https://volontirajsnama.onrender.com/login?token=" + token + "&role=" + role;
//
//            response.sendRedirect(redirectUrl);

            Map<String, String> response = new HashMap<>();
            response.put("jwt", token);
            response.put("role", role);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed");
    }

    public List<OrganizationProfileDto> getAllOrganizations() {
        List<Organization> organizations = organizationRepository.findAll();
        List<OrganizationProfileDto> lista = new ArrayList<>();

        for (Organization organization : organizations) {
            OrganizationProfileDto dto = new OrganizationProfileDto();
            dto = get_profile_info(organization.getId());
            lista.add(dto);
        }
        return lista;
    }

    public Long createproject(ProjectDto dto) {
        System.out.println(dto);
        Project project = new Project();

        project.setProjectName(dto.getName());
        project.setProjectDesc(dto.getDesc());
        project.setUrgent(dto.isUrgent());
        project.setMaxNumVolunteers(dto.getMaxNumVolunteers());
        project.setNumVolunteers(dto.getNumVolunteers());
        project.setStartDate(dto.getStart());
        project.setEndDate(dto.getEnd());
        project.setLocation(dto.getLocation());
        project.setTypeOfWork(TypeOfWork.valueOf(dto.getTypeOfWork()));

//        project.setStatus(Status.OPEN);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Organization organization = organizationRepository.findByUsername(username);
        if (organization == null) {
            throw new RuntimeException("Organizacija nije pronađena za korisnika: " + username);
        }
        project.setOrganizationID(organization.getId());

        System.out.println(project);
        projectRepository.save(project);

        // pronadi prijavljene na newsletter i posalji im mail
        List<Newsletter> newsletters = newsletterRepository.findAllByOrganizationId(organization.getId());

        for (Newsletter n : newsletters) {
            Volunteer v = volunteerRepository.findById(n.getVolunteerId()).get();

            String poruka = "Bok " + v.getFirstName() + "! 🤗" +
                    "\nOrganizacija " + organization.getOrganizationName() +
                    " objavila je novi projekt koji bi te mogao zanimati: " + project.getProjectName() +
                    "\n\nViše detalja možeš pronaći na njihovoj stranici profila. 🙌";

            emailService.sendEmail(v.getEmail(), "Nova prilika za volontiranje! 💌", poruka);
        }


        Map<String, Object> response = new HashMap<>();
        response.put("message", "Projekt uspješno dodan :)");
        return project.getProjectId();
    }

    public List<AppliedVolunteersDto> applications(Long projectId){
        List<Application> applications = applicationRepository.findAllByProjectId(projectId);

        List<AppliedVolunteersDto> lista = new ArrayList<>();
        for (Application application : applications) {

            Long volunteerId = application.getVolunteerId();
            Volunteer volunteer = volunteerRepository.findById(volunteerId).get();

            AppliedVolunteersDto appliedVolunteersDto = new AppliedVolunteersDto();
            appliedVolunteersDto.setFirstName(volunteer.getFirstName());
            appliedVolunteersDto.setLastName(volunteer.getLastName());
            appliedVolunteersDto.setVolunteerId(volunteer.getId());
            appliedVolunteersDto.setStatus(application.getStatus());

            lista.add(appliedVolunteersDto);
        }
        return lista;
    }

    public String accept(Long projectId, Long volunteerId){
        Project pr = projectRepository.findById(projectId).get();

        if (pr.getMaxNumVolunteers() >= pr.getNumVolunteers()){
            List<Application> applications = applicationRepository.findAllByProjectId(projectId);
            Application application = applications.stream().filter(app -> app.getVolunteerId().equals(volunteerId)).findFirst().get();
            application.setStatus(ApplicationStatus.ACCEPTED); // azuriraj status na ACCEPTED
            applicationRepository.save(application);

            Volunteer vol = volunteerRepository.findById(application.getVolunteerId()).get();
            Organization org = organizationRepository.findById(pr.getOrganizationID()).get();

            // povecaj broj prijavljenih
            pr.setNumVolunteers(pr.getNumVolunteers() + 1);
            projectRepository.save(pr);

            String poruka = "Organizacija " + org.getOrganizationName() +
                    " želi da budeš volonter na njihovom projektu " +
                    pr.getProjectName();

            emailService.sendEmail(vol.getEmail(), "primljen/a si na volontiranje! 🥳", poruka);

            return application.toString();
        }else{
            return "previse prijavljenih sorry";
        }


    }

    public String reject(Long projectId, Long volunteerId){
        List<Application> applications = applicationRepository.findAllByProjectId(projectId);
        Application application = applications.stream().filter(app -> app.getVolunteerId().equals(volunteerId)).findFirst().get();
        application.setStatus(ApplicationStatus.REJECTED);
        applicationRepository.delete(application);

        Volunteer vol = volunteerRepository.findById(application.getVolunteerId()).get();
        Project pr = projectRepository.findById(projectId).get();
        Organization org = organizationRepository.findById(pr.getOrganizationID()).get();

        String poruka = "Nažalost nisi odabran/a za volotiranje na projektu " +
                pr.getProjectName() + " :(";

        emailService.sendEmail(vol.getEmail(), "odluka o volontiranju", poruka);

        return application.toString();
    }

    public OrganizationProfileDto my_profile_info(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Organization organization = organizationRepository.findByUsername(username);

        return get_profile_info(organization.getId());
    }

    public OrganizationProfileDto get_profile_info(Long id){
        Organization organization = organizationRepository.findById(id).get();

        OrganizationProfileDto dto = new OrganizationProfileDto();
        dto.setName(organization.getOrganizationName());
        dto.setDescription(organization.getDescription());
        dto.setEmail(organization.getEmail());
        dto.setOrganizationId(organization.getId());

        List<TypeOfWork> areas = new ArrayList<>();
        for (OrganizationAreas a : areasOrganizationRepository.findAllByOrganizationId(id)){
            areas.add(a.getArea());
        }
        dto.setAreas_of_work(areas);

        return dto;
    }

    public String edit_profile(OrganizationProfileDto dto){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Organization org = organizationRepository.findByUsername(username);

        org.setOrganizationName(dto.getName());
        org.setEmail(dto.getEmail());
        org.setDescription(dto.getDescription());
        organizationRepository.save(org);

        // areas prije edita
        List<TypeOfWork> areas = areasOrganizationRepository.findAllByOrganizationId(org.getId())
                .stream()
                .map(OrganizationAreas::getArea) // Mapiraj na Area
                .collect(Collectors.toList());
        System.out.println("areas prije promjene: " + areas);

        for (TypeOfWork area : dto.getAreas_of_work()){
            if (!areas.contains(area)){
                OrganizationAreas o = new OrganizationAreas();
                o.setArea(area);
                o.setOrganizationId(org.getId());
                areasOrganizationRepository.save(o);
            }
        }

        return org.toString();
    }


    public ResponseEntity<byte[]> get_profile_picture(){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Organization org = organizationRepository.findByUsername(username);

        return get_picture_specific_org(org.getId());
    }

    public ResponseEntity<byte[]> get_picture_specific_org(Long organizationId){
        Organization org = organizationRepository.findById(organizationId).get();

        Optional<OrganizationPicture> o = organizationPictureRepository.findByOrganizationId(org.getId());
        if (o.isPresent()) {
            OrganizationPicture op = o.get();

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

    public ResponseEntity<Object> leave_response(ReviewResponseDto reviewResponseDto) {
    	try {
    		ReviewResponse reviewResponse = new ReviewResponse();
    		reviewResponse.setOriginalReviewID(reviewResponseDto.getReviewID());
    		reviewResponse.setComment(reviewResponseDto.getComment());
    		reviewResponse.setResponseDate(LocalDate.now());
    		reviewResponseRepository.save(reviewResponse);
    		return ResponseEntity.ok("Response published successfully");
    	}
    	catch (Error e) {
    		return ResponseEntity.badRequest().body(e);
    	}
    }

}
