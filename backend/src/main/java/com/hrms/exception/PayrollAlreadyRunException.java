package com.hrms.exception;

public class PayrollAlreadyRunException extends RuntimeException {
    public PayrollAlreadyRunException(String message) {
        super(message);
    }
}
