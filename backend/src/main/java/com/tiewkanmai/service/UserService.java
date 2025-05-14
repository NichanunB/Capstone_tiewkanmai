package com.tiewkanmai.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.tiewkanmai.dto.response.MessageResponse;
import com.tiewkanmai.model.User;
import com.tiewkanmai.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Get user by ID
     * 
     * @param id User ID
     * @return User
     */
    public User getUserById(Long id) {
        Optional<User> user = userRepository.findById(id);
        if (!user.isPresent()) {
            throw new UsernameNotFoundException("User not found with id: " + id);
        }
        return user.get();
    }

    /**
     * Get user by email
     * 
     * @param email User email
     * @return User
     */
    public User getUserByEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (!user.isPresent()) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        return user.get();
    }

    /**
     * Update user profile
     * 
     * @param id        User ID
     * @param firstName First name
     * @param lastName  Last name
     * @param email     Email
     * @param preferences Preferences
     * @return Updated User
     */
    public User updateProfile(Long id, String firstName, String lastName, String email, String preferences) {
        Optional<User> userOpt = userRepository.findById(id);
        if (!userOpt.isPresent()) {
            throw new UsernameNotFoundException("User not found with id: " + id);
        }

        User user = userOpt.get();

        // Check if email is being changed and if it already exists
        if (!user.getEmail().equals(email) && userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email is already in use!");
        }

        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPreferences(preferences);

        return userRepository.save(user);
    }

    /**
     * Change user password
     * 
     * @param id          User ID
     * @param oldPassword Old password
     * @param newPassword New password
     * @return MessageResponse
     */
    public MessageResponse changePassword(Long id, String oldPassword, String newPassword) {
        Optional<User> userOpt = userRepository.findById(id);
        if (!userOpt.isPresent()) {
            throw new UsernameNotFoundException("User not found with id: " + id);
        }

        User user = userOpt.get();

        // Verify old password
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            return new MessageResponse("Current password is incorrect!");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return new MessageResponse("Password changed successfully!");
    }

    /**
     * Delete user
     * 
     * @param id User ID
     * @return true if deleted, false otherwise
     */
    public boolean deleteUser(Long id) {
        Optional<User> user = userRepository.findById(id);
        if (!user.isPresent()) {
            return false;
        }

        userRepository.deleteById(id);
        return true;
    }
}