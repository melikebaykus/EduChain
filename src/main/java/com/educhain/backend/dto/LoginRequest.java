package com.educhain.backend.dto;

public class LoginRequest {

    private String identifier;
    private String password;

    public LoginRequest() {
    }

    public String getIdentifier() {
        return identifier;
    }

    public String getPassword() {
        return password;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}