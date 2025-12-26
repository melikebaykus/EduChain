package com.educhain.backend.dto;

public class VerifyResponse {

    private String status;

    // ✅ Frontend uyumlu constructor
    public VerifyResponse(String status) {
        this.status = status;
    }

    // ✅ Getter
    public String getStatus() {
        return status;
    }

    // (opsiyonel ama sorun çıkarmaz)
    public void setStatus(String status) {
        this.status = status;
    }
}
