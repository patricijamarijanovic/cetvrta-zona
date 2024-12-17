package com.example.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.backend.model.MyUser;
import com.example.backend.repository.MyUserRepository;

public class VerifyService {

	@Autowired
	private MyUserRepository myUserRepository;
	
	public boolean verifyUser(String token) {
		Optional<MyUser> userOpt = myUserRepository.findByVerificationToken(token);
		if (userOpt.isEmpty()) {
			return false;
		} else {
			MyUser user = userOpt.get();
			user.setVerified(true);
			myUserRepository.save(user);
			return true;
		}
	}
}
