package com.example.backend.dto;

import java.time.LocalDate;

public class ProjectResponseDto {
    private String projectname;
    private String projectdesc;
    private LocalDate beginningdate;
    private LocalDate enddate;
    private String projectlocation;
    private int numregisteredvolunteers;
    private int maxnumvolunteers;
    private String status;
    private long projectID;
    private boolean urgent;
    private String organizationName;

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

    public int getNumregisteredvolunteers() {
        return numregisteredvolunteers;
    }

    public void setNumregisteredvolunteers(int numregisteredvolunteers) {
        this.numregisteredvolunteers = numregisteredvolunteers;
    }

    public int getMaxnumvolunteers() {
        return maxnumvolunteers;
    }

    public void setMaxnumvolunteers(int maxnumvolunteers) {
        this.maxnumvolunteers = maxnumvolunteers;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public long getProjectID() {
        return projectID;
    }

    public void setProjectID(long projectID) {
        this.projectID = projectID;
    }

    public boolean isUrgent() {
        return urgent;
    }

    public void setUrgent(boolean urgent) {
        this.urgent = urgent;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }
}