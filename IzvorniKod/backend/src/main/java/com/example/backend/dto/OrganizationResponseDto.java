package com.example.backend.dto;

public class OrganizationResponseDto {
    private String organizationName;


    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    @Override
    public String toString() {
        return "OrganizationResponseDto{" +
                "organizationName='" + organizationName + '\'' +
                '}';
    }
}
