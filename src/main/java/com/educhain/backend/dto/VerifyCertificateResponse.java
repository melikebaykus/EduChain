package com.educhain.backend.dto;

public class VerifyCertificateResponse {

    private boolean valid;
    private String message;

    public VerifyCertificateResponse(boolean valid, String message) {
        this.valid = valid;
        this.message = message;
    }

    public boolean isValid() {
        return valid;
    }

    public String getMessage() {
        return message;
    }
}