package com.hrms.dto;

import java.math.BigDecimal;

public class AppraisalRatingRequest {
    private BigDecimal rating; // 1.0 to 5.0
    private String feedback;
    private BigDecimal incrementPct;

    public AppraisalRatingRequest() {}

    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public BigDecimal getIncrementPct() { return incrementPct; }
    public void setIncrementPct(BigDecimal incrementPct) { this.incrementPct = incrementPct; }
}
