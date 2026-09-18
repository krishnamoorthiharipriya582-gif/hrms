package com.hrms.controller;

import com.hrms.dto.LoginRequest;
import com.hrms.dto.LoginResponse;
import com.hrms.entity.Employee;
import com.hrms.entity.User;
import com.hrms.repository.EmployeeRepository;
import com.hrms.repository.UserRepository;
import com.hrms.security.JwtTokenProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtTokenProvider tokenProvider,
                          UserRepository userRepository,
                          EmployeeRepository employeeRepository) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String role = user.getRole().name();
        String employeeIdStr = user.getEmployeeId() != null ? user.getEmployeeId().toString() : "";
        String token = tokenProvider.generateToken(user.getUsername(), role, employeeIdStr);

        String fullName = user.getUsername();
        String designation = "System Administrator";
        String department = "Corporate";

        if (user.getEmployeeId() != null) {
            Optional<Employee> emp = employeeRepository.findById(user.getEmployeeId());
            if (emp.isPresent()) {
                fullName = emp.get().getFullName();
                designation = emp.get().getDesignation();
                department = emp.get().getDepartment() != null ? emp.get().getDepartment().getName() : "General";
            }
        }

        LoginResponse response = new LoginResponse(
                token,
                user.getUsername(),
                user.getRole().name(),
                user.getEmployeeId(),
                fullName,
                designation,
                department
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Unauthenticated");
        }
        User user = userRepository.findByUsername(authentication.getName()).orElse(null);
        return ResponseEntity.ok(user);
    }
}
