package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.backend.model.ReviewResponse;

@Repository
public interface ReviewResponseRepository extends JpaRepository<ReviewResponse, Integer>{

}
