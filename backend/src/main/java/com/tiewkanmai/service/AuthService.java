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

import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    /**
     * ตรวจสอบความถูกต้องของผู้ใช้ และสร้าง JWT Token
     */
    public JwtResponse authenticateUser(@Valid LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(),
                loginRequest.getPassword()
            )
        );

        // เซ็ต authentication context ให้ระบบรู้ว่าใครกำลังล็อกอินอยู่
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // ดึง user detail ที่ล็อกอินสำเร็จ
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        // สร้าง JWT token
        String jwt = jwtUtils.generateJwtToken(authentication);

        return new JwtResponse(
            jwt,
            userDetails.getId(),
            userDetails.getFirstName(),
            userDetails.getLastName(),
            userDetails.getEmail()
        );
    }

    /**
     * ลงทะเบียนผู้ใช้ใหม่
     */
    public MessageResponse registerUser(@Valid RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return new MessageResponse("Error: Email นี้ถูกใช้งานแล้ว!");
        }

        // สร้างบัญชีใหม่
        User user = new User(
            signUpRequest.getFirstName(),
            signUpRequest.getLastName(),
            signUpRequest.getEmail(),
            encoder.encode(signUpRequest.getPassword())
        );

        userRepository.save(user);

        return new MessageResponse("สมัครสมาชิกสำเร็จ!");
    }
}
