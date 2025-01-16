package com.example.backend.security;

import com.example.backend.repository.MyUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    @Autowired
    private MyUserDetailsService myUserDetailsService;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private Oauth2AuthenticationSuccessHandler oauth2AuthenticationSuccessHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(withDefaults())
                .authorizeHttpRequests(registry -> {
                    registry.requestMatchers("/", "/home/**",
                            "/register/**", "/authenticate",
                            "/oauth2/**", "/login/**", "/h2-console/**", "/verify", "/getreviews/**").permitAll() // dostupne svakome
                    .requestMatchers(request -> 
	                    request.getRequestURI().startsWith("/verify") && 
	                    request.getParameter("token") != null
                    ).permitAll(); 
                    registry.requestMatchers("/volunteer/**").hasRole("VOLUNTEER");
                    registry.requestMatchers("/admin/**").hasRole("ADMIN");
                    registry.requestMatchers("/organization/**").hasRole("ORGANIZATION");
                    registry.anyRequest().hasRole("ADMIN");
                })
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(oauth2AuthenticationSuccessHandler)
                        .permitAll()
                )
                .formLogin(formLogin -> formLogin.permitAll())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)) // 401 Unauthorized
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            // Kada korisnik pokušava pristupiti resursu bez odgovarajuće privilegije, vraća status 403
                            response.setStatus(HttpStatus.FORBIDDEN.value()); // 403 Forbidden
                            response.getWriter().write("{\"error\": \"You do not have permission to access this resource\"}");
                            response.setContentType("application/json");
                        })
                )
                .headers((headers) -> headers.disable())
                .build();
    }


    // ovo se koristi za kodiranje lozinki
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // dohvaća podatke o korisnicima
    @Bean
    public UserDetailsService userDetailsService() {
        return myUserDetailsService;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(myUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        return new ProviderManager(authenticationProvider());
    }
}
