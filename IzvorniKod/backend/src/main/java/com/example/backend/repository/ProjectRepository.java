package com.example.backend.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.backend.model.Project;

@Repository
public interface ProjectRepository extends JpaRepository <Project, Long>{

	List<Project> findAllByOrganizationID(Long organizationID);
//
//	List<Project> findAll();
//
//	List<Project> findAllByTypeofworkAndProjectlocation(String typeOfWork, String projectLocation);
//
//	List<Project> findAllByTypeofwork(String typeOfWork);
//
//	List<Project> findAllByProjectlocation(String projectLocation);
}
