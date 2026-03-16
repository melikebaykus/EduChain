package com.educhain.backend.dto;

public class RegisterEmployerRequest {

    private String institutionName;
    private String email;
    private String password;

    public RegisterEmployerRequest() {
    }

    public String getInstitutionName() {
        return institutionName;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public void setInstitutionName(String institutionName) {
        this.institutionName = institutionName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}