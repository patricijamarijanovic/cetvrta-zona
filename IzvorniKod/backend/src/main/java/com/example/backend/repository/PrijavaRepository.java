package com.example.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.backend.model.Prijava;

@Repository
public interface PrijavaRepository extends JpaRepository<Prijava, Long> {
	Optional<Prijava> findByPrijavaID(Long prijavaID);
	
	List<Prijava> findAllByProjektID(Integer projektID);
	
	Optional<Prijava> findByProjektIDAndVolunteerID (Integer projektID, Long volunteerID);
	
	List<Prijava> findAllByVolunteerID(Long volunteerID);

}
