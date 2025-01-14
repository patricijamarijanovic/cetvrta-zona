package com.example.backend.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.backend.model.Project;
import com.example.backend.model.TypeOfWork;
import com.example.backend.repository.ProjectRepository;

@Service
public class FilteringService {

	@Autowired
	private ProjectRepository projectRepository;
	
    public FilteringService() {}
    
    public List<Project> filterProjects(String typeOfWork, String projectLocation, LocalDate startDate, LocalDate endDate) {
    	List<Project> l = new ArrayList<Project>();
    	if (typeOfWork.equals(null) && projectLocation.equals(null)) {
    		l = projectRepository.findAll();
    	} else if (typeOfWork.equals(null)) {
    		l = projectRepository.findAllByLocation(projectLocation);
    	} else if (projectLocation.equals(null)) {
    		TypeOfWork tow = TypeOfWork.valueOf(typeOfWork);
    		l = projectRepository.findAllByTypeOfWork(tow);
    	} else {
    		TypeOfWork tow = TypeOfWork.valueOf(typeOfWork);
    		l = projectRepository.findAllByTypeOfWorkAndLocation(tow, projectLocation);
    	}
    	List<Project> filteredList = new ArrayList<Project>();

    	int s = l.size();

    	for (int i = 0; i < s; i++) {
    		Project p = l.get(i);
    		if ((startDate.equals(null)) ||
    			(p.getStartDate().isAfter(startDate)) ||
    			(p.getStartDate().equals(startDate))) {
    			if ((endDate.equals(null)) ||
    				(p.getEndDate().isBefore(endDate)) ||
    				(p.getEndDate().equals(endDate))) {
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
