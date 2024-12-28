package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.backend.model.Review;

@Repository
public interface ReviewRepository extends JpaRepository <Review, Integer>{
	
}
