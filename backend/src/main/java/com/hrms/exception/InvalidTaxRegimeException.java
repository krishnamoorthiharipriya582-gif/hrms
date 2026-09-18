package com.hrms.exception;

public class InvalidTaxRegimeException extends RuntimeException {
    public InvalidTaxRegimeException(String message) {
        super(message);
    }
}
