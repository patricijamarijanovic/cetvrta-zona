package com.example.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.ReviewDisplayDto;
import com.example.backend.service.ReviewAndResponseService;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "https://volontirajsnama.onrender.com"})
public class ReviewAndResponseController {
	
	@Autowired
	private ReviewAndResponseService reviewAndResponseService;
	
	@GetMapping("/getreviews/{projectID}")
	public List<ReviewDisplayDto> get_all_reviews_by_projectID(@PathVariable Integer projectID) {
		return reviewAndResponseService.get_all_reviews_by_projectID(projectID);
	}
}
