package com.example.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // Omogućiti CORS za sve rute, uključujući one koje zahtijevaju uloge
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5173", "https://volontirajsnama.onrender.com") // Dozvoljena domena frontend-a
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Dozvoljene metode
                        .allowedHeaders("Authorization", "Content-Type", "Accept") // Dozvoljeni headeri
                        .allowCredentials(true); // Ako koristiš kolačiće, dozvoli slanje kolačića
            }
        };
    }
}
