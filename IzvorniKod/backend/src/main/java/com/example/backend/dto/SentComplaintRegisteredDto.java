package com.example.backend.dto;

public class SentComplaintRegisteredDto {
    private String title;
    private String description;

    @Override
    public String toString() {
        return "SentComplaintRegisteredDto{" +
                "title='" + title + '\'' +
                ", description='" + description + '\'' +
                '}';
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
