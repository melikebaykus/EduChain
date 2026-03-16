package com.educhain.backend.dto;

public class LoginResponse {

    private String status;
    private String message;
    private String role;
    private String fullName;
    private String email;
    private String token;

    public LoginResponse() {
    }

    public LoginResponse(String status, String message, String role, String fullName, String email, String token) {
        this.status = status;
        this.message = message;
        this.role = role;
        this.fullName = fullName;
        this.email = email;
        this.token = token;
    }

    public String getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

    public String getRole() {
        return role;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getToken() {
        return token;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setToken(String token) {
        this.token = token;
    }
}