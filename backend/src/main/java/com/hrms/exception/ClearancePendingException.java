package com.hrms.exception;

public class ClearancePendingException extends RuntimeException {
    public ClearancePendingException(String message) {
        super(message);
    }
}
