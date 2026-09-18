package com.hrms.dto;

import java.time.LocalDate;

public class ResignationRequest {
    private LocalDate resignationDate;
    private String reason;

    public ResignationRequest() {}

    public LocalDate getResignationDate() { return resignationDate; }
    public void setResignationDate(LocalDate resignationDate) { this.resignationDate = resignationDate; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
