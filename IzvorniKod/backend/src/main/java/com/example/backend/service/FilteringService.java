package com.example.backend.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.model.Project;
import com.example.backend.repository.ProjectRepository;

@Service
public class FilteringService {

	@Autowired
	private ProjectRepository projectRepository;
	
    public FilteringService() {}
    
    public List<Project> filterProjects(String typeOfWork, String projectLocation, LocalDate beginningdate, LocalDate enddate) {
    	List<Project> l = new ArrayList<Project>();
    	if (typeOfWork == null && projectLocation == null) {
    		l = projectRepository.findAll();
    	} else if (typeOfWork == null) {
    		l = projectRepository.findAllByProjectLocation(projectLocation);
    	} else if (projectLocation == null) {
    		l = projectRepository.findAllByTypeOfWork(typeOfWork);
    	} else {
    		l = projectRepository.findAllByTypeOfWorkAndProjectLocation(typeOfWork, projectLocation);
    	}
    	List<Project> filteredList = new ArrayList<Project>();
    	
    	int s = l.size();
    	
    	for (int i = 0; i < s; i++) {
    		Project p = l.get(i);
    		if ((beginningdate == null) || 
    			(p.getBeginningdate().isAfter(beginningdate)) || 
    			(p.getBeginningdate().equals(beginningdate))) {
    			if ((enddate == null) ||
    				(p.getEnddate().isBefore(enddate)) ||
    				(p.getEnddate().equals(enddate))) {
    				filteredList.add(p);
    			}
    		}
    	}
    	
    	filteredList.sort((project1, project2) -> {
    		if(project1.getUrgent() && !project2.getUrgent()) return 1;
    		else if (!project1.getUrgent() && project2.getUrgent()) return -1;
    		else return 0;
    	});
    	
    	return filteredList;
    }
	
}
