package com.example.erp.compta_flow.exception;

public class AccountingException extends RuntimeException {
    public AccountingException(String message) {
        super(message);
    }
    public AccountingException(String message, Throwable cause) {
        super(message, cause);
    }
}
