package com.example.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "volunteer_skills")
public class VolunteerSkills {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long volunteerId;

    @Enumerated(EnumType.STRING)
    private Skill skill;



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getVolunteerId() {
        return volunteerId;
    }

    public void setVolunteerId(Long volunteerId) {
        this.volunteerId = volunteerId;
    }

    public Skill getSkill() {
        return skill;
    }

    public void setSkill(Skill skill) {
        this.skill = skill;
    }

    @Override
    public String toString() {
        return "VolunteerSkills{" +
                "id=" + id +
                ", volunteerId=" + volunteerId +
                ", skill=" + skill +
                '}';
    }
}
