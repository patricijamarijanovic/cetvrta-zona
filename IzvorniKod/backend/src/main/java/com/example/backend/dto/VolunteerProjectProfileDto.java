package com.example.backend.dto;

import com.example.backend.model.TypeOfWork;

import java.time.LocalDate;


// kada korisnik gleda na svom profilu svoje prosle/buduce/trenutne aktivnosti
public class VolunteerProjectProfileDto {
    private Long projectID;
    private String projectname;
    private String projectdesc;
    private TypeOfWork typeofwork;
    private LocalDate beginningdate;
    private LocalDate enddate;
    private String organizationName;
    private long organizationID;
    private String projectlocation;


    public String getProjectlocation() {
        return projectlocation;
    }

    public void setProjectlocation(String projectlocation) {
        this.projectlocation = projectlocation;
    }

    public Long getProjectID() {
        return projectID;
    }

    public void setProjectID(Long projectID) {
        this.projectID = projectID;
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

    public TypeOfWork getTypeofwork() {
        return typeofwork;
    }

    public void setTypeofwork(TypeOfWork typeofwork) {
        this.typeofwork = typeofwork;
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

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    public long getOrganizationID() {
        return organizationID;
    }

    public void setOrganizationID(long organizationID) {
        this.organizationID = organizationID;
    }

    @Override
    public String toString() {
        return "VolunteerProjectProfileDto{" +
                "projectID=" + projectID +
                ", projectname='" + projectname + '\'' +
                ", projectdesc='" + projectdesc + '\'' +
                ", typeofwork=" + typeofwork +
                ", beginningdate=" + beginningdate +
                ", enddate=" + enddate +
                ", organizationName='" + organizationName + '\'' +
                ", organizationID=" + organizationID +
                ", projectlocation='" + projectlocation + '\'' +
                '}';
    }
}
