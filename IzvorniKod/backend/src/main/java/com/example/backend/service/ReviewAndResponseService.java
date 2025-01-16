package com.example.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.ReviewDisplayDto;
import com.example.backend.dto.ReviewResponseDisplayDto;
import com.example.backend.model.Review;
import com.example.backend.model.ReviewResponse;
import com.example.backend.repository.MyUserRepository;
import com.example.backend.repository.ReviewRepository;
import com.example.backend.repository.ReviewResponseRepository;

@Service
public class ReviewAndResponseService {
	
	@Autowired
	private ReviewRepository reviewRepository;
	
	@Autowired
	private ReviewResponseRepository reviewResponseRepository;
	
	@Autowired
	private MyUserRepository myUserRepository;
	
	public List<ReviewDisplayDto> get_all_reviews_by_projectID(Integer projectID) {
		List<Review> reviewList = reviewRepository.findAllByProjectID(projectID);
		List<ReviewDisplayDto> returnList = new ArrayList<ReviewDisplayDto>();
		
		for (Review review : reviewList) {
			ReviewDisplayDto rdd = new ReviewDisplayDto();
			rdd.setComment(review.getComment());
			rdd.setRating(review.getRating());
			rdd.setReviewDate(review.getReviewDate());
			rdd.setVolunteerUsername(myUserRepository.findById(review.getVolunteerID()).get().getUsername());
			Optional<ReviewResponse> rr = reviewResponseRepository.findByOriginalReviewID(review.getReviewID());
			
			if(rr.isPresent()) {
				ReviewResponseDisplayDto response = new ReviewResponseDisplayDto();
				response.setComment(rr.get().getComment());
				response.setResponseDate(rr.get().getResponseDate());
				rdd.setResponse(response);
			} else {
				rdd.setResponse(null);
			}
			
			returnList.add(rdd);
		}
		
		return returnList;
	}
	
}
