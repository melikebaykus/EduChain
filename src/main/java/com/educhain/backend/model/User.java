package com.educhain.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    public enum Role {
        GRADUATE,
        EMPLOYER
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    @Column(unique = true)
    private String username;

    @Column(unique = true)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String universityName;
    private String department;
    private String studentNumber;
    private String institutionName;

    public User() {
    }

    public User(Long id, String fullName, String username, String email, String password, Role role,
                String universityName, String department, String studentNumber, String institutionName) {
        this.id = id;
        this.fullName = fullName;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.universityName = universityName;
        this.department = department;
        this.studentNumber = studentNumber;
        this.institutionName = institutionName;
    }

    public Long getId() {
        return id;
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

    public String getPassword() {
        return password;
    }

    public Role getRole() {
        return role;
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

    public String getInstitutionName() {
        return institutionName;
    }

    public void setId(Long id) {
        this.id = id;
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

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRole(Role role) {
        this.role = role;
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

    public void setInstitutionName(String institutionName) {
        this.institutionName = institutionName;
    }
}