package com.example.backend;

import com.example.backend.model.*;
import com.example.backend.repository.*;

import com.example.backend.service.VolunteerService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;

@SpringBootApplication
public class BackendApplication {
	
	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	CommandLineRunner commandLineRunner(MyUserRepository userRepository, OrganizationRepository organizationRepository, VolunteerService volunteerService, VolunteerRepository volunteerRepository, ProjectRepository projectRepository, ApplicationRepository applicationRepository) {
		return args -> {
			MyUser user = new MyUser();
			user.setRole(Role.ADMIN);
			user.setUsername("admin");
			user.setEmail("admin@example.com");
			user.setPassword("$2a$10$hd.K4YAUxErbA/F1IQvsAetXSaRHBG80cKTKFaJhUBuwGDhZDwu7a");
			user.setVerified(true);
			userRepository.save(user);

			Volunteer user2 = new Volunteer();
			user2.setRole(Role.VOLUNTEER);
			user2.setUsername("volonter");
			user2.setEmail("mail@gmail.com");
			user2.setPassword("$2a$10$hd.K4YAUxErbA/F1IQvsAetXSaRHBG80cKTKFaJhUBuwGDhZDwu7a");
			user2.setVerified(true);
			volunteerRepository.save(user2);

			Organization user3 = new Organization();
			user3.setRole(Role.ORGANIZATION);
			user3.setUsername("klaiceva");
			user3.setEmail("mail2@gmail.com");
			user3.setPassword("$2a$10$hd.K4YAUxErbA/F1IQvsAetXSaRHBG80cKTKFaJhUBuwGDhZDwu7a");
			user3.setVerified(true);
			user3.setOrganizationName("Klaiceva bolnica");
			user3.setDescription("ovo je opis organizacije");
			organizationRepository.save(user3);

			Project project = new Project();
			project.setUrgent(true);
			project.setProjectName("Akcija doniranja krvi");
			project.setProjectDesc("opis");
			project.setOrganizationID(user3.getId());
			project.setLocation("Zagreb");
			project.setEndDate(LocalDate.of(2024, 1, 31));
			project.setStartDate(LocalDate.of(2024, 2, 28));
			project.setMaxNumVolunteers(30);
			project.setNumVolunteers(0);
			project.setTypeOfWork(TypeOfWork.DJECA);
			projectRepository.save(project);
			
			Application application = new Application();
			application.setVolunteerId(user2.getId());
			application.setProjectId(project.getProjectId());
			application.setStatus(ApplicationStatus.ACCEPTED);
			applicationRepository.save(application);

		};
	}
	
}
