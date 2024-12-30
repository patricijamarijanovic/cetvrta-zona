package com.example.backend.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name ="projects")
public class Project {
	@NotBlank
	private String projectname;
	
	@NotBlank
	private String projectdesc;
	
	@NotBlank
	private String typeofwork;
	
	@NotNull
	private LocalDate beginningdate;
	
	@NotNull
	private LocalDate enddate;
	
	@NotBlank
	private String projectlocation;
	
	@NotNull
	private Integer numregisteredvolunteers;
	
	@NotNull
	private Integer maxnumvolunteers;
	
	@NotNull
	private String status;
	
//	@SequenceGenerator(name = "project_seq", sequenceName = "project_seq", allocationSize = 1)
//	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "project_seq")
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer projectID;
	
	@NotNull
	private Boolean urgent;
	
	@NotNull
	private Long organizationID;
	
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

	public void setNumregisteredvolunteers(@NotNull Integer numregisteredvolunteers) {
		this.numregisteredvolunteers = numregisteredvolunteers;
	}

	public void registerVolunteer() throws Exception {
		if (numregisteredvolunteers < maxnumvolunteers) numregisteredvolunteers++;
		else throw new Exception("Mjesta su popunjena, nije moguce prijaviti novog volontera");
	}
	public void rejectVolunteer() {
		numregisteredvolunteers--;
	}
	public String getProjectname() {
		return projectname;
	}
	public void setProjectname(String projectname) {
		this.projectname = projectname;
	}
	public String getProjectdesc() {
		return projectdesc;
	}
	public void setProjectdesc(String projectdesc) {
		this.projectdesc = projectdesc;
	}
	public LocalDate getBeginningdate() {
		return beginningdate;
	}
	public void setBeginningdate(LocalDate beginningdate) {
		this.beginningdate = beginningdate;
	}
	public LocalDate getEnddate() {
		return enddate;
	}
	public void setEnddate(LocalDate enddate) {
		this.enddate = enddate;
	}
	public String getProjectlocation() {
		return projectlocation;
	}
	public void setProjectlocation(String projectlocation) {
		this.projectlocation = projectlocation;
	}
	public Integer getMaxnumvolunteers() {
		return maxnumvolunteers;
	}
	public void setMaxnumvolunteers(Integer maxnumvolunteers) {
		this.maxnumvolunteers = maxnumvolunteers;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public Integer getProjectID() {
		return projectID;
	}
	public void setProjectID(Integer projectID) {
		this.projectID = projectID;
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
	
	public String getTypeOfWork() {
		return typeofwork;
	}

	public void setTypeOfWork(String typeOfWork) {
		this.typeofwork = typeOfWork;
	}
	
	@Override
	public String toString() {
		return "Project [projectname=" + projectname + ", projectdesc=" + projectdesc + ", beginningdate="
				+ beginningdate + ", enddate=" + enddate + ", projectlocation=" + projectlocation
				+ ", numregisteredvolunteers=" + numregisteredvolunteers + ", maxnumvolunteers=" + maxnumvolunteers
				+ ", status=" + status + ", projectID=" + projectID + ", urgent=" + urgent + ", organizationID="
				+ organizationID + "]";
	}
	public Integer getNumregisteredvolunteers() {
		return numregisteredvolunteers;
	}
}
