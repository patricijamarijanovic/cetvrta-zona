package com.example.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "organization_picture")
public class OrganizationPicture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long organizationId;
    private Long imageId;



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }

    public Long getImageId() {
        return imageId;
    }

    public void setImageId(Long imageId) {
        this.imageId = imageId;
    }

    @Override
    public String toString() {
        return "OrganizationPicture{" +
                "id=" + id +
                ", organizationId=" + organizationId +
                ", imageId=" + imageId +
                '}';
    }
}
