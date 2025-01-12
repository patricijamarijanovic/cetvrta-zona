package com.example.backend.dto;

import java.time.LocalDate;

public class ProjectFilteringRequestDto {
	private String typeOfWork;
	private String projectLocation;
	private LocalDate startDate;
	private LocalDate endDate;
	
	public ProjectFilteringRequestDto() {}
	
	public String getTypeOfWork() {
		return typeOfWork;
	}
	public void setTypeOfWork(String typeOfWork) {
		this.typeOfWork = typeOfWork;
	}
	public String getProjectLocation() {
		return projectLocation;
	}
	public void setProjectLocation(String projectLocation) {
		this.projectLocation = projectLocation;
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
	@Override
	public String toString() {
		return "ProjectFilteringRequestDto [typeOfWork=" + typeOfWork + ", projectLocation=" + projectLocation
				+ ", startDate=" + startDate + ", endDate=" + endDate + "]";
	}
}
