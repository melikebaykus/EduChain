package com.educhain.backend.dto;

public class UploadCertificateResponse {

    private String transactionHash;

    public UploadCertificateResponse(String transactionHash) {
        this.transactionHash = transactionHash;
    }

    public String getTransactionHash() {
        return transactionHash;
    }
}
