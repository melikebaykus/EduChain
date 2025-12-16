package com.educhain.backend.dto;

public class VerifyResponse {

    private String status;

    public VerifyResponse(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }
}
