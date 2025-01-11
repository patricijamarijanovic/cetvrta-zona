package com.example.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "project_picture")
public class ProjectPicture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long projectId;
    private Long imageId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public Long getImageId() {
        return imageId;
    }

    public void setImageId(Long imageId) {
        this.imageId = imageId;
    }

    @Override
    public String toString() {
        return "ProjectPicture{" +
                "id=" + id +
                ", projectId=" + projectId +
                ", imageId=" + imageId +
                '}';
    }
}
