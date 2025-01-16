package com.example.backend.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="reviewResponse")
public class ReviewResponse {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer responseID;
	private Integer originalReviewID;
	private String comment;
	private LocalDate responseDate;
	
	public ReviewResponse() {}

	public Integer getResponseID() {
		return responseID;
	}

	public void setResponseID(Integer responseID) {
		this.responseID = responseID;
	}

	public Integer getOriginalReviewID() {
		return originalReviewID;
	}

	public void setOriginalReviewID(Integer originalReviewID) {
		this.originalReviewID = originalReviewID;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public LocalDate getResponseDate() {
		return responseDate;
	}

	public void setResponseDate(LocalDate responseDate) {
		this.responseDate = responseDate;
	}
	
	
}
