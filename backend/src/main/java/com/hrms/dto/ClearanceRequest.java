package com.hrms.dto;

public class ClearanceRequest {
    private String department; // IT, ADMIN, FINANCE, HR
    private boolean cleared;
    private String notes;

    public ClearanceRequest() {}

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public boolean isCleared() { return cleared; }
    public void setCleared(boolean cleared) { this.cleared = cleared; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
