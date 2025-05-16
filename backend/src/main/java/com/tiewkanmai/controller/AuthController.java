package com.tiewkanmai.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tiewkanmai.dto.request.LoginRequest;
import com.tiewkanmai.dto.request.RegisterRequest;
import com.tiewkanmai.dto.response.JwtResponse;
import com.tiewkanmai.dto.response.MessageResponse;
import com.tiewkanmai.service.AuthService;

@CrossOrigin(
  origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"},
  allowCredentials = "true",
  maxAge = 3600
)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        JwtResponse response = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<MessageResponse> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        MessageResponse response = authService.registerUser(signUpRequest);
        return ResponseEntity.ok(response);
    }
}
