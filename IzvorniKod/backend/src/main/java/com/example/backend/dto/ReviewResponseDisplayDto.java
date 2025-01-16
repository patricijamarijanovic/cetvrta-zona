package com.example.backend.dto;

import java.time.LocalDate;

public class ReviewResponseDisplayDto {
	private String comment;
	private LocalDate responseDate;
	
	public ReviewResponseDisplayDto() {}
	
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
