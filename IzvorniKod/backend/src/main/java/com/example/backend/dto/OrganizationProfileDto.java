package com.example.backend.dto;

import com.example.backend.model.TypeOfWork;

import java.util.List;

public class OrganizationProfileDto {
    private String name;
    private String description;
    private List<TypeOfWork> areas_of_work;
    private String email;
    // + logo


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<TypeOfWork> getAreas_of_work() {
        return areas_of_work;
    }

    public void setAreas_of_work(List<TypeOfWork> areas_of_work) {
        this.areas_of_work = areas_of_work;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return "OrganizationProfileDto{" +
                "name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", areas_of_work=" + areas_of_work +
                ", email='" + email + '\'' +
                '}';
    }
}
