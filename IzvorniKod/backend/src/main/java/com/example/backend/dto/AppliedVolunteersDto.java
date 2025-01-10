package com.example.backend.dto;

import com.example.backend.model.ApplicationStatus;

//aaaa
public class AppliedVolunteersDto {
    String firstName;
    String lastName;
    Long volunteerId;
    ApplicationStatus status;

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

    public Long getVolunteerId() {
        return volunteerId;
    }

    public void setVolunteerId(Long volunteerId) {
        this.volunteerId = volunteerId;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "AppliedVolunteersDto{" +
                "firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", volunteerId=" + volunteerId +
                ", status=" + status +
                '}';
    }
}
