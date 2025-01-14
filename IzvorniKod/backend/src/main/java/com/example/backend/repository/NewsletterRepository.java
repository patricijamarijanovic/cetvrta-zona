package com.example.backend.repository;

import com.example.backend.model.Newsletter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsletterRepository extends JpaRepository<Newsletter, Long> {
    List<Newsletter> findAllByOrganizationId(Long organizationId);
    List<Newsletter> findAllByVolunteerId(Long volunteerId);
}
