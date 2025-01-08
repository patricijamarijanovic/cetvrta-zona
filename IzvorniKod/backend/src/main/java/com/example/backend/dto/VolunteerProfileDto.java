package com.example.backend.dto;

import com.example.backend.model.Skill;
import com.example.backend.model.TypeOfWork;

import java.time.LocalDate;
import java.util.List;

public class VolunteerProfileDto {
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String location;
    private String phone;
    private String email;
    private List<TypeOfWork> interests;
    private List<Skill> skills;

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<TypeOfWork> getInterests() {
        return interests;
    }

    public void setInterests(List<TypeOfWork> interests) {
        this.interests = interests;
    }

    public List<Skill> getSkills() {
        return skills;
    }

    public void setSkills(List<Skill> skills) {
        this.skills = skills;
    }

    @Override
    public String toString() {
        return "VolunteerProfileDto{" +
                "firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", dateOfBirth=" + dateOfBirth +
                ", location='" + location + '\'' +
                ", phone='" + phone + '\'' +
                ", email='" + email + '\'' +
                ", interests=" + interests +
                ", skills=" + skills +
                '}';
    }
}
