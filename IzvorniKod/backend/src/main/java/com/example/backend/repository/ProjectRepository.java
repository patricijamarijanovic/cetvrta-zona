package com.example.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.backend.model.Project;
import com.example.backend.model.TypeOfWork;

@Repository
public interface ProjectRepository extends JpaRepository <Project, Long>{
	List<Project> findAllByOrganizationID(Long organizationID);
	
	List<Project> findAll();
	
	List<Project> findAllByLocation(String location);
	
	List<Project> findAllByTypeOfWork(TypeOfWork typeOfWork);
	
	List<Project> findAllByTypeOfWorkAndLocation(TypeOfWork typeOfWork, String location);

}
