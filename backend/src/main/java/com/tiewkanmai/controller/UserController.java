package com.tiewkanmai.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.tiewkanmai.dto.response.MessageResponse;
import com.tiewkanmai.model.User;
import com.tiewkanmai.security.services.UserDetailsImpl;
import com.tiewkanmai.service.UserService;

import jakarta.validation.Valid;

@CrossOrigin(
  origins = {"http://localhost:5173", "http://localhost:3000"},
  allowCredentials = "true",
  maxAge = 3600
)
@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    UserService userService;

    @GetMapping
    public ResponseEntity<?> getUserProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        
        User user = userService.getUserById(userDetails.getId());
        
        return ResponseEntity.ok().body(new User(
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                null)); // Don't send password
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@Valid @RequestBody User userUpdate) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        
        User updatedUser = userService.updateProfile(
                userDetails.getId(),
                userUpdate.getFirstName(),
                userUpdate.getLastName(),
                userUpdate.getEmail(),
                userUpdate.getPreferences()
        );
        
        return ResponseEntity.ok().body(new MessageResponse("Profile updated successfully!"));
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody PasswordChangeRequest passwordRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        
        MessageResponse response = userService.changePassword(
                userDetails.getId(),
                passwordRequest.getOldPassword(),
                passwordRequest.getNewPassword()
        );
        
        return ResponseEntity.ok().body(response);
    }
}

// Inner class for password change request
class PasswordChangeRequest {
    private String oldPassword;
    private String newPassword;

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}