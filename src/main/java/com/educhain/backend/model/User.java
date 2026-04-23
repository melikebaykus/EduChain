package com.educhain.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    public enum Role {
        GRADUATE,
        EMPLOYER,
        UNIVERSITY
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
    private String walletAddress;

    // Profil alanları
    private String title;
    private String city;
    private String faculty;
    private String phone;
    private String linkedIn;
    private String github;
    private String twitter;
    private String portfolio;
    private String address;

    @Column(length = 5000)
    private String graduationInfo;

    @Column(length = 5000)
    private String summary;

    @Column(length = 5000)
    private String skills;

    @Column(length = 5000)
    private String languages;

    @Column(length = 5000)
    private String hobbies;

    @Column(length = 5000)
    private String experience;

    @Column(length = 5000)
    private String projects;

    @Column(length = 5000)
    private String certificates;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String photoBase64;

    public User() {
    }

    public User(Long id, String fullName, String username, String email, String password, Role role,
                String universityName, String department, String studentNumber,
                String institutionName, String walletAddress, String title, String city,
                String faculty, String phone, String linkedIn, String github, String twitter,
                String portfolio, String address, String graduationInfo, String summary,
                String skills, String languages, String hobbies, String experience,
                String projects, String certificates, String photoBase64) {
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
        this.walletAddress = walletAddress;
        this.title = title;
        this.city = city;
        this.faculty = faculty;
        this.phone = phone;
        this.linkedIn = linkedIn;
        this.github = github;
        this.twitter = twitter;
        this.portfolio = portfolio;
        this.address = address;
        this.graduationInfo = graduationInfo;
        this.summary = summary;
        this.skills = skills;
        this.languages = languages;
        this.hobbies = hobbies;
        this.experience = experience;
        this.projects = projects;
        this.certificates = certificates;
        this.photoBase64 = photoBase64;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getUniversityName() {
        return universityName;
    }

    public void setUniversityName(String universityName) {
        this.universityName = universityName;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getStudentNumber() {
        return studentNumber;
    }

    public void setStudentNumber(String studentNumber) {
        this.studentNumber = studentNumber;
    }

    public String getInstitutionName() {
        return institutionName;
    }

    public void setInstitutionName(String institutionName) {
        this.institutionName = institutionName;
    }

    public String getWalletAddress() {
        return walletAddress;
    }

    public void setWalletAddress(String walletAddress) {
        this.walletAddress = walletAddress;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getFaculty() {
        return faculty;
    }

    public void setFaculty(String faculty) {
        this.faculty = faculty;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLinkedIn() {
        return linkedIn;
    }

    public void setLinkedIn(String linkedIn) {
        this.linkedIn = linkedIn;
    }

    public String getGithub() {
        return github;
    }

    public void setGithub(String github) {
        this.github = github;
    }

    public String getTwitter() {
        return twitter;
    }

    public void setTwitter(String twitter) {
        this.twitter = twitter;
    }

    public String getPortfolio() {
        return portfolio;
    }

    public void setPortfolio(String portfolio) {
        this.portfolio = portfolio;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getGraduationInfo() {
        return graduationInfo;
    }

    public void setGraduationInfo(String graduationInfo) {
        this.graduationInfo = graduationInfo;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getLanguages() {
        return languages;
    }

    public void setLanguages(String languages) {
        this.languages = languages;
    }

    public String getHobbies() {
        return hobbies;
    }

    public void setHobbies(String hobbies) {
        this.hobbies = hobbies;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getProjects() {
        return projects;
    }

    public void setProjects(String projects) {
        this.projects = projects;
    }

    public String getCertificates() {
        return certificates;
    }

    public void setCertificates(String certificates) {
        this.certificates = certificates;
    }

    public String getPhotoBase64() {
        return photoBase64;
    }

    public void setPhotoBase64(String photoBase64) {
        this.photoBase64 = photoBase64;
    }
}