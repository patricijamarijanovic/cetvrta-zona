package com.example.backend.dto;

public class AppliedVolunteersDto {
    String firstName;
    String lastName;
    Long volunteerId;

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

    @Override
    public String toString() {
        return "AppliedVolunteersDto{" +
                "firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", volunteerId=" + volunteerId +
                '}';
    }
}
