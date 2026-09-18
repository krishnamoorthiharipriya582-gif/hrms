package com.hrms.dto;

public class PunchRequest {
    private String source = "MOBILE"; // BIOMETRIC, MOBILE
    private Double latitude;
    private Double longitude;
    private String remarks;

    public PunchRequest() {}

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
