package com.example.backend.repository;

import com.example.backend.model.Skill;
import com.example.backend.model.VolunteerSkills;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillsRepository extends JpaRepository<VolunteerSkills, Long> {
    List<VolunteerSkills> findAllByVolunteerId(Long volunteerId);
}
