package com.example.backend;

import com.example.backend.model.MyUser;
import com.example.backend.model.Role;
import com.example.backend.repository.MyUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	CommandLineRunner commandLineRunner(MyUserRepository userRepository) {
		return args -> {
			MyUser user = new MyUser();
			user.setRole(Role.ADMIN);
			user.setUsername("admin");
			user.setEmail("admin@example.com");
			user.setPassword("$2a$10$hd.K4YAUxErbA/F1IQvsAetXSaRHBG80cKTKFaJhUBuwGDhZDwu7a");
			userRepository.save(user);
		};
	}
	
}
