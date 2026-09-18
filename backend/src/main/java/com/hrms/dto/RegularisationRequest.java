package com.hrms.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class RegularisationRequest {
    private LocalDate workDate;
    private LocalTime inPunch;
    private LocalTime outPunch;
    private String reason;

    public RegularisationRequest() {}

    public LocalDate getWorkDate() { return workDate; }
    public void setWorkDate(LocalDate workDate) { this.workDate = workDate; }

    public LocalTime getInPunch() { return inPunch; }
    public void setInPunch(LocalTime inPunch) { this.inPunch = inPunch; }

    public LocalTime getOutPunch() { return outPunch; }
    public void setOutPunch(LocalTime outPunch) { this.outPunch = outPunch; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
