package com.example.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "volunteers")

public class Volunteer extends MyUser {
    private String firstName;
    private String lastName;

    private LocalDate dateOfBirth;

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


    @Override
    public String toString() {
        return "Volunteer{" +
                "firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +

                ", dateOfBirth=" + dateOfBirth +
                '}';
    }
}
