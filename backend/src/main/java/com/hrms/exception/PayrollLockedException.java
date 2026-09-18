package com.hrms.exception;

public class PayrollLockedException extends RuntimeException {
    public PayrollLockedException(String message) {
        super(message);
    }
}
