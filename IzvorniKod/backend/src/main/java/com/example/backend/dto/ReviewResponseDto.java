package com.example.backend.dto;

public class ReviewResponseDto {
	private String comment;
	private Integer reviewID;
	
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	public Integer getReviewID() {
		return reviewID;
	}
	public void setReviewID(Integer reviewID) {
		this.reviewID = reviewID;
	}
	
	
}
