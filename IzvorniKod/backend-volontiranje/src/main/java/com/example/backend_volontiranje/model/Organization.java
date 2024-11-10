package com.example.backend_volontiranje.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "organizations")
public class Organization extends MyUser{
    private String email;
    private String organizationName;


    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }


    @Override
    public String toString() {
        return "Organization{" +
                ", organizationName='" + organizationName + '\'' +
                '}';
    }
}