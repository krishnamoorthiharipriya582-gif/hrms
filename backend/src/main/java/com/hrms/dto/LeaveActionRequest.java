package com.hrms.dto;

public class LeaveActionRequest {
    private String status; // APPROVED, REJECTED
    private String managerComments;

    public LeaveActionRequest() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getManagerComments() { return managerComments; }
    public void setManagerComments(String managerComments) { this.managerComments = managerComments; }
}
