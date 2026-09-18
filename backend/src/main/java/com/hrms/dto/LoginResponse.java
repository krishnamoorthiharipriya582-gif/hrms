package com.hrms.dto;

import java.util.UUID;

public class LoginResponse {
    private String token;
    private String tokenType = "Bearer";
    private String username;
    private String role;
    private UUID employeeId;
    private String fullName;
    private String designation;
    private String department;

    public LoginResponse() {}

    public LoginResponse(String token, String username, String role, UUID employeeId, String fullName, String designation, String department) {
        this.token = token;
        this.tokenType = "Bearer";
        this.username = username;
        this.role = role;
        this.employeeId = employeeId;
        this.fullName = fullName;
        this.designation = designation;
        this.department = department;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public UUID getEmployeeId() { return employeeId; }
    public void setEmployeeId(UUID employeeId) { this.employeeId = employeeId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
}
