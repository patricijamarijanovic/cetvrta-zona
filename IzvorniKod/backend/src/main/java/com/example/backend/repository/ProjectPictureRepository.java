package com.example.backend.repository;

import com.example.backend.model.ProjectPicture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProjectPictureRepository extends JpaRepository<ProjectPicture, Long> {
    Optional<ProjectPicture> findByProjectId(Long id);
}
