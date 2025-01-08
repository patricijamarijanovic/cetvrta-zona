package com.example.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "volunteer_interests")
public class VolunteerInterests {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long volunteerId;

    @Enumerated(EnumType.STRING)
    private TypeOfWork interest;



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

    public TypeOfWork getInterest() {
        return interest;
    }

    public void setInterest(TypeOfWork interest) {
        this.interest = interest;
    }

    @Override
    public String toString() {
        return "VolunteerInterests{" +
                "id=" + id +
                ", volunteerId=" + volunteerId +
                ", interest=" + interest +
                '}';
    }
}
