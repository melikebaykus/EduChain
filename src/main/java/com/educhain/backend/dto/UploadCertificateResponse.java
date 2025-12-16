package com.educhain.backend.dto;

public class UploadCertificateResponse {
    private Long certificateId;
    private String diplomaHash;

    public UploadCertificateResponse(Long certificateId, String diplomaHash) {
        this.certificateId = certificateId;
        this.diplomaHash = diplomaHash;
    }

    public Long getCertificateId() { return certificateId; }
    public String getDiplomaHash() { return diplomaHash; }
}
