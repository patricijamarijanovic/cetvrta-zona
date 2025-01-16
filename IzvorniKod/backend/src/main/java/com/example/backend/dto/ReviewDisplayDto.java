package com.example.backend.dto;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class ReviewDisplayDto {
	private Integer rating;
	private String comment;
	private LocalDate reviewDate;
	private String volunteerUsername;
	private ReviewResponseDisplayDto response; 
	
	public ReviewDisplayDto() {}
	
	public Integer getRating() {
		return rating;
	}
	public void setRating(Integer rating) {
		this.rating = rating;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	public LocalDate getReviewDate() {
		return reviewDate;
	}
	public void setReviewDate(LocalDate reviewDate) {
		this.reviewDate = reviewDate;
	}
	public String getVolunteerUsername() {
		return volunteerUsername;
	}
	public void setVolunteerUsername(String volunteerUsername) {
		this.volunteerUsername = volunteerUsername;
	}

	public ReviewResponseDisplayDto getResponse() {
		return response;
	}

	public void setResponse(ReviewResponseDisplayDto response) {
		this.response = response;
	}
	
	
}
