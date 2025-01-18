package com.example.backend.dto;

public class ComplaintResponseDto {
    private String response;

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    @Override
    public String toString() {
        return "ComplaintResponseDto{" +
                "response='" + response + '\'' +
                '}';
    }
}
