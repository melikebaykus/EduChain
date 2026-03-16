package com.educhain.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentName;

    private String studentNumber;

    private String department;

    private String universityName;

    @Column(unique = true)
    private String walletAddress;

    public Student() {
    }

    public Student(Long id, String studentName, String studentNumber, String department, String universityName, String walletAddress) {
        this.id = id;
        this.studentName = studentName;
        this.studentNumber = studentNumber;
        this.department = department;
        this.universityName = universityName;
        this.walletAddress = walletAddress;
    }

    public Long getId() {
        return id;
    }

    public String getStudentName() {
        return studentName;
    }

    public String getStudentNumber() {
        return studentNumber;
    }

    public String getDepartment() {
        return department;
    }

    public String getUniversityName() {
        return universityName;
    }

    public String getWalletAddress() {
        return walletAddress;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public void setStudentNumber(String studentNumber) {
        this.studentNumber = studentNumber;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public void setUniversityName(String universityName) {
        this.universityName = universityName;
    }

    public void setWalletAddress(String walletAddress) {
        this.walletAddress = walletAddress;
    }
}