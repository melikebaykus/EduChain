package com.educhain.backend.dto;

public class RegisterUniversityRequest {

    private String universityName;
    private String email;
    private String password;

    public RegisterUniversityRequest() {}

    public String getUniversityName() { return universityName; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }

    public void setUniversityName(String universityName) { this.universityName = universityName; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
}