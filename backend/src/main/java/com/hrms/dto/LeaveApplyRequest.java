package com.hrms.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class LeaveApplyRequest {
    private String leaveType; // CL, SL, EL, ML, PL, COMP_OFF
    private LocalDate fromDate;
    private LocalDate toDate;
    private BigDecimal days;
    private String reason;

    public LeaveApplyRequest() {}

    public String getLeaveType() { return leaveType; }
    public void setLeaveType(String leaveType) { this.leaveType = leaveType; }

    public LocalDate getFromDate() { return fromDate; }
    public void setFromDate(LocalDate fromDate) { this.fromDate = fromDate; }

    public LocalDate getToDate() { return toDate; }
    public void setToDate(LocalDate toDate) { this.toDate = toDate; }

    public BigDecimal getDays() { return days; }
    public void setDays(BigDecimal days) { this.days = days; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
