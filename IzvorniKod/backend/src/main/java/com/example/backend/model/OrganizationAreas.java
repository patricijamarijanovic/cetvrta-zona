package com.example.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "organization_areas")
public class OrganizationAreas {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long organizationId;

    @Enumerated(EnumType.STRING)
    private TypeOfWork area;



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

    public TypeOfWork getArea() {
        return area;
    }

    public void setArea(TypeOfWork area) {
        this.area = area;
    }

    @Override
    public String toString() {
        return "OrganizationAreas{" +
                "id=" + id +
                ", organizationId=" + organizationId +
                ", area=" + area +
                '}';
    }
}
