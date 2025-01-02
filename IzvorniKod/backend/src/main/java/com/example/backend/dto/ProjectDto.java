package com.example.backend.dto;

import com.example.backend.model.TypeOfWork;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class ProjectDto {
    private String name;
    private String desc;
    private String typeOfWork;
    private LocalDate start;
    private LocalDate end;
    private String location;
    private Integer neededNumVolunteers;
    private Integer maxNumVolunteers;
    private boolean urgent;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public String getTypeOfWork() {
        return typeOfWork;
    }

    public void setTypeOfWork(String typeOfWork) {
        this.typeOfWork = typeOfWork;
    }

    public LocalDate getStart() {
        return start;
    }

    public void setStart(LocalDate start) {
        this.start = start;
    }

    public LocalDate getEnd() {
        return end;
    }

    public void setEnd(LocalDate end) {
        this.end = end;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getNeededNumVolunteers() {
        return neededNumVolunteers;
    }

    public void setNeededNumVolunteers(Integer neededNumVolunteers) {
        this.neededNumVolunteers = neededNumVolunteers;
    }

    public Integer getMaxNumVolunteers() {
        return maxNumVolunteers;
    }

    public void setMaxNumVolunteers(Integer maxNumVolunteers) {
        this.maxNumVolunteers = maxNumVolunteers;
    }

    public boolean isUrgent() {
        return urgent;
    }

    public void setUrgent(boolean urgent) {
        this.urgent = urgent;
    }

    @Override
    public String toString() {
        return "ProjectDto{" +
                "name='" + name + '\'' +
                ", desc='" + desc + '\'' +
                ", typeOfWork='" + typeOfWork + '\'' +
                ", start=" + start +
                ", end=" + end +
                ", location='" + location + '\'' +
                ", neededNumVolunteers=" + neededNumVolunteers +
                ", maxNumVolunteers=" + maxNumVolunteers +
                ", urgent=" + urgent +
                '}';
    }
}
