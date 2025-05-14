package com.tiewkanmai.service;

import com.tiewkanmai.dto.request.LoginRequest;
import com.tiewkanmai.dto.request.RegisterRequest;
import com.tiewkanmai.dto.response.JwtResponse;
import com.tiewkanmai.dto.response.MessageResponse;
import com.tiewkanmai.model.User;
import com.tiewkanmai.repository.UserRepository;
import com.tiewkanmai.security.jwt.JwtUtils;
import com.tiewkanmai.security.services.UserDetailsImpl;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    public JwtResponse authenticateUser(@Valid LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(),
                loginRequest.getPassword()
            )
        );

        // ✅ สำคัญมาก: เซ็ต Authentication context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String jwt = jwtUtils.generateJwtToken(authentication);

        List<String> roles = userDetails.getAuthorities().stream()
            .map(item -> item.getAuthority())
            .collect(Collectors.toList());

        return new JwtResponse(jwt,
            userDetails.getId(),
            userDetails.getFirstName(),
            userDetails.getLastName(),
            userDetails.getEmail());
    }

    public MessageResponse registerUser(@Valid RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return new MessageResponse("Error: Email is already in use!");
        }

        // Create new user account
        User user = new User(
            signUpRequest.getFirstName(),
            signUpRequest.getLastName(),
            signUpRequest.getEmail(),
            encoder.encode(signUpRequest.getPassword())
        );

        userRepository.save(user);

        return new MessageResponse("User registered successfully!");
    }
}
