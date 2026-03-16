package com.educhain.backend.dto;

public class RegisterGraduateRequest {

    private String fullName;
    private String username;
    private String email;
    private String universityName;
    private String department;
    private String studentNumber;
    private String password;

    public RegisterGraduateRequest() {
    }

    public String getFullName() {
        return fullName;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getUniversityName() {
        return universityName;
    }

    public String getDepartment() {
        return department;
    }

    public String getStudentNumber() {
        return studentNumber;
    }

    public String getPassword() {
        return password;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setUniversityName(String universityName) {
        this.universityName = universityName;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public void setStudentNumber(String studentNumber) {
        this.studentNumber = studentNumber;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}