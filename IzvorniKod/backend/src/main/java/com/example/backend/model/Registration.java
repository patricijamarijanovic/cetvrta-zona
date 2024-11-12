package com.example.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name ="registration")
public class Registration {
	@SequenceGenerator(name = "registration_seq", sequenceName = "registration_seq", allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "registration_seq")
	@Id
	private Long registrationID;
	private LocalDateTime registrationDate;
	private String registrationStatus;
	private Integer projectID;
	private Long volunteerID;
	
	public Registration() {}

	public Long getRegistrationID() {
		return registrationID;
	}

	public void setRegistrationID(Long registrationID) {
		this.registrationID = registrationID;
	}

	public LocalDateTime getRegistrationDate() {
		return registrationDate;
	}

	public void setRegistrationDate(LocalDateTime registrationDate) {
		this.registrationDate = registrationDate;
	}

	public String getRegistrationStatus() {
		return registrationStatus;
	}

	public void setRegistrationStatus(String registrationStatus) {
		this.registrationStatus = registrationStatus;
	}

	public Integer getProjectID() {
		return projectID;
	}

	public void setProjectID(Integer projectID) {
		this.projectID = projectID;
	}

	public Long getVolunteerID() {
		return volunteerID;
	}

	public void setVolunteerID(Long volunteerID) {
		this.volunteerID = volunteerID;
	}

	@Override
	public String toString() {
		return "Registration [registrationID=" + registrationID + ", registrationDate=" + registrationDate
				+ ", registrationStatus=" + registrationStatus + ", projectID=" + projectID + ", volunteerID="
				+ volunteerID + "]";
	}
	
	
	
}
