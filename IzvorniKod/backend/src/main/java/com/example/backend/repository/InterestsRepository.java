package com.example.backend.repository;

import com.example.backend.model.VolunteerInterests;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterestsRepository extends JpaRepository<VolunteerInterests, Long> {
    List<VolunteerInterests> findAllByVolunteerId(Long id);
}
