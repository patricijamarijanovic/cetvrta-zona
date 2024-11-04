package com.example.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
public class JwtService {
    private static final String SECRET = "1446254B6DF6789365A77C9244F62F656D555EC98852E8170F249D88D7BFAFCE6CBE27C532797B1E91ACA7DC52181E0578524FE902D1AB9DF4F2A681042B58B0";
    private static final long VALIDITY = TimeUnit.MINUTES.toMillis(30);

    public String generateToken(UserDetails userDetails) {
        Map<String, String> claims = new HashMap<>();

        return Jwts.builder()
                .claims(claims)
                .subject(userDetails.getUsername())
                .issuedAt(Date.from(Instant.now()))
                .expiration(Date.from(Instant.now().plusMillis(VALIDITY)))
                .signWith(generateKey())
                .compact();

    }

    private SecretKey generateKey(){
        byte[] decodedeKey = Base64.getDecoder().decode(SECRET);
        return Keys.hmacShaKeyFor(decodedeKey);
    }

    public String extractUsername(String jwt) {
        Claims claims = Jwts.parser()
                .verifyWith(generateKey())
                .build()
                .parseClaimsJws(jwt)
                .getPayload();
        return claims.getSubject();
    }

    public boolean isTokenValid(String jwt) {
        Claims claims = Jwts.parser()
                .verifyWith(generateKey())
                .build()
                .parseClaimsJws(jwt)
                .getPayload();
        return claims.getExpiration().after(Date.from(Instant.now()));

    }
}
