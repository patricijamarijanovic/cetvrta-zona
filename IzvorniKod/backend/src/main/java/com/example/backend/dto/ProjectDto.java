package com.example.backend.dto;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class ProjectDto {
    private String projectname;
    private String projectdesc;
    private LocalDate beginningdate;
    private LocalDate enddate;
    private String projectlocation;
    private Integer numregisteredvolunteers;
    private Integer maxnumvolunteers;

    private Boolean urgent;

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

    public Integer getNumregisteredvolunteers() {
        return numregisteredvolunteers;
    }

    public void setNumregisteredvolunteers(Integer numregisteredvolunteers) {
        this.numregisteredvolunteers = numregisteredvolunteers;
    }

    public Integer getMaxnumvolunteers() {
        return maxnumvolunteers;
    }

    public void setMaxnumvolunteers(Integer maxnumvolunteers) {
        this.maxnumvolunteers = maxnumvolunteers;
    }


    public Boolean getUrgent() {
        return urgent;
    }

    public void setUrgent(Boolean urgent) {
        this.urgent = urgent;
    }

    @Override
    public String toString() {
        return "ProjectDto{" +
                "projectname='" + projectname + '\'' +
                ", projectdesc='" + projectdesc + '\'' +
                ", beginningdate=" + beginningdate +
                ", enddate=" + enddate +
                ", projectlocation='" + projectlocation + '\'' +
                ", numregisteredvolunteers=" + numregisteredvolunteers +
                ", maxnumvolunteers=" + maxnumvolunteers +
                ", urgent=" + urgent +
                '}';
    }
}
