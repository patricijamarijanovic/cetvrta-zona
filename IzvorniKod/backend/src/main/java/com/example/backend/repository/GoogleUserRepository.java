package com.example.backend.repository;

import com.example.backend.model.GoogleUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GoogleUserRepository extends JpaRepository<GoogleUser, Long> {
    Optional<GoogleUser> findByEmail(String email);
}
