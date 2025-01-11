package com.example.backend.repository;

import com.example.backend.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findAllByProjectId(Long projectId);
    List<Application> findAllByVolunteerId(Long volunteerId);
}
