package com.educhain.backend.dto;

public class IssueCertificateResponse {

    private String status;
    private String studentName;
    private String studentNumber;
    private String walletAddress;
    private String hash;
    private String transactionHash;

    public IssueCertificateResponse() {
    }

    public IssueCertificateResponse(String status, String studentName, String studentNumber,
                                    String walletAddress, String hash, String transactionHash) {
        this.status = status;
        this.studentName = studentName;
        this.studentNumber = studentNumber;
        this.walletAddress = walletAddress;
        this.hash = hash;
        this.transactionHash = transactionHash;
    }

    public String getStatus() {
        return status;
    }

    public String getStudentName() {
        return studentName;
    }

    public String getStudentNumber() {
        return studentNumber;
    }

    public String getWalletAddress() {
        return walletAddress;
    }

    public String getHash() {
        return hash;
    }

    public String getTransactionHash() {
        return transactionHash;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public void setStudentNumber(String studentNumber) {
        this.studentNumber = studentNumber;
    }

    public void setWalletAddress(String walletAddress) {
        this.walletAddress = walletAddress;
    }

    public void setHash(String hash) {
        this.hash = hash;
    }

    public void setTransactionHash(String transactionHash) {
        this.transactionHash = transactionHash;
    }
}