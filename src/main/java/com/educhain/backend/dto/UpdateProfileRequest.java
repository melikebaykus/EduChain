package com.educhain.backend.dto;

public class UpdateProfileRequest {

    private String fullName;
    private String title;
    private String city;
    private String faculty;
    private String universityName;
    private String department;
    private String phone;
    private String linkedin;
    private String github;
    private String twitter;
    private String portfolio;
    private String address;
    private String graduationInfo;
    private String summary;
    private String skills;
    private String languages;
    private String hobbies;
    private String experience;
    private String projects;
    private String certificates;
    private String photoBase64;

    public UpdateProfileRequest() {}

    public String getFullName() { return fullName; }
    public String getTitle() { return title; }
    public String getCity() { return city; }
    public String getFaculty() { return faculty; }
    public String getUniversityName() { return universityName; }
    public String getDepartment() { return department; }
    public String getPhone() { return phone; }
    public String getLinkedin() { return linkedin; }
    public String getGithub() { return github; }
    public String getTwitter() { return twitter; }
    public String getPortfolio() { return portfolio; }
    public String getAddress() { return address; }
    public String getGraduationInfo() { return graduationInfo; }
    public String getSummary() { return summary; }
    public String getSkills() { return skills; }
    public String getLanguages() { return languages; }
    public String getHobbies() { return hobbies; }
    public String getExperience() { return experience; }
    public String getProjects() { return projects; }
    public String getCertificates() { return certificates; }
    public String getPhotoBase64() { return photoBase64; }

    public void setFullName(String fullName) { this.fullName = fullName; }
    public void setTitle(String title) { this.title = title; }
    public void setCity(String city) { this.city = city; }
    public void setFaculty(String faculty) { this.faculty = faculty; }
    public void setUniversityName(String universityName) { this.universityName = universityName; }
    public void setDepartment(String department) { this.department = department; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setLinkedin(String linkedin) { this.linkedin = linkedin; }
    public void setGithub(String github) { this.github = github; }
    public void setTwitter(String twitter) { this.twitter = twitter; }
    public void setPortfolio(String portfolio) { this.portfolio = portfolio; }
    public void setAddress(String address) { this.address = address; }
    public void setGraduationInfo(String graduationInfo) { this.graduationInfo = graduationInfo; }
    public void setSummary(String summary) { this.summary = summary; }
    public void setSkills(String skills) { this.skills = skills; }
    public void setLanguages(String languages) { this.languages = languages; }
    public void setHobbies(String hobbies) { this.hobbies = hobbies; }
    public void setExperience(String experience) { this.experience = experience; }
    public void setProjects(String projects) { this.projects = projects; }
    public void setCertificates(String certificates) { this.certificates = certificates; }
    public void setPhotoBase64(String photoBase64) { this.photoBase64 = photoBase64; }
}