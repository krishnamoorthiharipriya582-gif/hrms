package com.hrms.dto;

public class PayrollRunRequest {
    private String runMonth; // Format: YYYY-MM

    public PayrollRunRequest() {}
    public PayrollRunRequest(String runMonth) {
        this.runMonth = runMonth;
    }

    public String getRunMonth() { return runMonth; }
    public void setRunMonth(String runMonth) { this.runMonth = runMonth; }
}
