package com.example.backend.repository;

import com.example.backend.model.VolunteerPicture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VolunteerPictureRepository extends JpaRepository<VolunteerPicture, Long> {
    Optional<VolunteerPicture> findByVolunteerId(Long id);
}
