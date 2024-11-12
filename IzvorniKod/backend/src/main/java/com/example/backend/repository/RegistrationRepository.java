package com.example.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.backend.model.Registration;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
	Optional<Registration> findByRegistrationID(Long registrationID);
	
	List<Registration> findAllByProjectID(Integer projectID);
	
	Optional<Registration> findByProjectIDAndVolunteerID (Integer projectID, Long volunteerID);
	
	List<Registration> findAllByVolunteerID(Long volunteerID);

}
