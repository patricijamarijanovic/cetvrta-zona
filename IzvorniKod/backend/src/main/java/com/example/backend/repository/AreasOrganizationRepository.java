package com.example.backend.repository;

import com.example.backend.model.OrganizationAreas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AreasOrganizationRepository extends JpaRepository<OrganizationAreas, Long> {
    List<OrganizationAreas> findAllByOrganizationId(Long organizationId);
}
