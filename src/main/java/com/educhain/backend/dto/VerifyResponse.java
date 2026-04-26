package com.educhain.backend.dto;

public class VerifyResponse {

    private boolean valid;
    private String status;

    // ✅ Frontend { valid: boolean } bekliyor
    public VerifyResponse(boolean valid, String status) {
        this.valid = valid;
        this.status = status;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}