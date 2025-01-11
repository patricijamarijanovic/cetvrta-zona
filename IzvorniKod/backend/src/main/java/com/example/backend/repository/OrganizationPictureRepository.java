package com.example.backend.repository;

import com.example.backend.model.OrganizationPicture;
import com.example.backend.model.VolunteerPicture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrganizationPictureRepository extends JpaRepository<OrganizationPicture, Long> {
    Optional<OrganizationPicture> findByOrganizationId(Long id);
}
