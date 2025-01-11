package com.example.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "volunteer_picture")
public class VolunteerPicture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long volunteerId;
    private Long imageId;

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

    public Long getImageId() {
        return imageId;
    }

    public void setImageId(Long imageId) {
        this.imageId = imageId;
    }

    @Override
    public String toString() {
        return "VolunteerPicture{" +
                "id=" + id +
                ", volunteerId=" + volunteerId +
                ", imageId=" + imageId +
                '}';
    }
}
