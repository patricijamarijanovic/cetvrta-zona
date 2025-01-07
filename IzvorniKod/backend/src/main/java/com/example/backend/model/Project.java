package com.example.backend.model;

import java.time.LocalDate;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name ="projects")
public class Project {

	//	@SequenceGenerator(name = "project_seq", sequenceName = "project_seq", allocationSize = 1)
//	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "project_seq")
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long projectId;

	private String projectName;

	private String projectDesc;

	@Enumerated(EnumType.STRING)
	private TypeOfWork typeOfWork;

	private LocalDate startDate;

	private LocalDate endDate;

	private String location;

	private Integer numVolunteers;

	private Integer maxNumVolunteers;

	@Enumerated(EnumType.STRING)
	private Status status;

	private Boolean urgent;

	private Long organizationID;

	public Long getProjectId() {
		return projectId;
	}

	public void setProjectId(Long projectId) {
		this.projectId = projectId;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public String getProjectDesc() {
		return projectDesc;
	}

	public void setProjectDesc(String projectDesc) {
		this.projectDesc = projectDesc;
	}

	public TypeOfWork getTypeOfWork() {
		return typeOfWork;
	}

	public void setTypeOfWork(TypeOfWork typeOfWork) {
		this.typeOfWork = typeOfWork;
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}

	public LocalDate getEndDate() {
		return endDate;
	}

	public void setEndDate(LocalDate endDate) {
		this.endDate = endDate;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}



	public Integer getMaxNumVolunteers() {
		return maxNumVolunteers;
	}

	public void setMaxNumVolunteers(Integer maxNumVolunteers) {
		this.maxNumVolunteers = maxNumVolunteers;
	}

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}

	public Boolean getUrgent() {
		return urgent;
	}

	public void setUrgent(Boolean urgent) {
		this.urgent = urgent;
	}

	public Long getOrganizationID() {
		return organizationID;
	}

	public void setOrganizationID(Long organizationID) {
		this.organizationID = organizationID;
	}

	public Integer getNumVolunteers() {
		return numVolunteers;
	}

	public void setNumVolunteers(Integer numVolunteers) {
		this.numVolunteers = numVolunteers;
	}

	@Override
	public String toString() {
		return "Project{" +
				"projectId=" + projectId +
				", projectName='" + projectName + '\'' +
				", projectDesc='" + projectDesc + '\'' +
				", typeOfWork=" + typeOfWork +
				", startDate=" + startDate +
				", endDate=" + endDate +
				", location='" + location + '\'' +
				", numVolunteers=" + numVolunteers +
				", maxNumVolunteers=" + maxNumVolunteers +
				", status=" + status +
				", urgent=" + urgent +
				", organizationID=" + organizationID +
				'}';
	}

	/*
	 * public Project(@NotBlank String naziv, @NotBlank String opis, @NotNull
	 * LocalDate pocetak, @NotNull LocalDate kraj,
	 * 
	 * @NotBlank String lokacija, @NotNull Integer maksBrojVolontera, @NotNull
	 * Status status, @NotNull Boolean hitan,
	 * 
	 * @NotNull Long organizationID) { super(); this.naziv = naziv; this.opis =
	 * opis; this.pocetak = pocetak; this.kraj = kraj; this.lokacija = lokacija;
	 * this.maksbrojvolontera = maksBrojVolontera; this.status = status; this.hitan
	 * = hitan; this.organizationID = organizationID; this.brojprijavljenihvolontera
	 * = 0; }
	 */

}
