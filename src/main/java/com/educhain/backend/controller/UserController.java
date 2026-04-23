package com.educhain.backend.controller;

import com.educhain.backend.dto.UpdateProfileRequest;
import com.educhain.backend.model.User;
import com.educhain.backend.repository.UserRepository;
import com.educhain.backend.service.JwtService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public UserController(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getMe(
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        Map<String, Object> errorMap = new HashMap<>();

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            errorMap.put("error", "Token bulunamadı.");
            return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON).body(errorMap);
        }

        String token = authHeader.substring(7);

        if (!jwtService.isTokenValid(token)) {
            errorMap.put("error", "Token geçersiz.");
            return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON).body(errorMap);
        }

        String email = jwtService.extractEmail(token);
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            errorMap.put("error", "Kullanıcı bulunamadı.");
            return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON).body(errorMap);
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(buildUserResponse(userOpt.get()));
    }

    @PutMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody UpdateProfileRequest request
    ) {
        Map<String, Object> errorMap = new HashMap<>();

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            errorMap.put("error", "Token bulunamadı.");
            return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON).body(errorMap);
        }

        String token = authHeader.substring(7);

        if (!jwtService.isTokenValid(token)) {
            errorMap.put("error", "Token geçersiz.");
            return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON).body(errorMap);
        }

        String email = jwtService.extractEmail(token);
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            errorMap.put("error", "Kullanıcı bulunamadı.");
            return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON).body(errorMap);
        }

        User user = userOpt.get();

        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) user.setFullName(request.getFullName());
        if (request.getTitle() != null && !request.getTitle().trim().isEmpty()) user.setTitle(request.getTitle());
        if (request.getCity() != null && !request.getCity().trim().isEmpty()) user.setCity(request.getCity());
        if (request.getFaculty() != null && !request.getFaculty().trim().isEmpty()) user.setFaculty(request.getFaculty());
        if (request.getUniversityName() != null && !request.getUniversityName().trim().isEmpty()) user.setUniversityName(request.getUniversityName());
        if (request.getDepartment() != null && !request.getDepartment().trim().isEmpty()) user.setDepartment(request.getDepartment());
        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) user.setPhone(request.getPhone());
        if (request.getLinkedin() != null && !request.getLinkedin().trim().isEmpty()) user.setLinkedIn(request.getLinkedin());
        if (request.getGithub() != null && !request.getGithub().trim().isEmpty()) user.setGithub(request.getGithub());
        if (request.getTwitter() != null && !request.getTwitter().trim().isEmpty()) user.setTwitter(request.getTwitter());
        if (request.getPortfolio() != null && !request.getPortfolio().trim().isEmpty()) user.setPortfolio(request.getPortfolio());
        if (request.getAddress() != null && !request.getAddress().trim().isEmpty()) user.setAddress(request.getAddress());
        if (request.getGraduationInfo() != null && !request.getGraduationInfo().trim().isEmpty()) user.setGraduationInfo(request.getGraduationInfo());
        if (request.getSummary() != null && !request.getSummary().trim().isEmpty()) user.setSummary(request.getSummary());
        if (request.getSkills() != null && !request.getSkills().trim().isEmpty()) user.setSkills(request.getSkills());
        if (request.getLanguages() != null && !request.getLanguages().trim().isEmpty() && !request.getLanguages().equals("[]")) user.setLanguages(request.getLanguages());
        if (request.getHobbies() != null && !request.getHobbies().trim().isEmpty()) user.setHobbies(request.getHobbies());
        if (request.getExperience() != null && !request.getExperience().trim().isEmpty() && !request.getExperience().equals("[]")) user.setExperience(request.getExperience());
        if (request.getProjects() != null && !request.getProjects().trim().isEmpty() && !request.getProjects().equals("[]")) user.setProjects(request.getProjects());
        if (request.getCertificates() != null && !request.getCertificates().trim().isEmpty() && !request.getCertificates().equals("[]")) user.setCertificates(request.getCertificates());
        if (request.getPhotoBase64() != null && !request.getPhotoBase64().trim().isEmpty()) user.setPhotoBase64(request.getPhotoBase64());

        try {
            userRepository.save(user);
        } catch (Exception e) {
            errorMap.put("error", "Kayıt hatası: " + e.getMessage());
            return ResponseEntity.internalServerError().contentType(MediaType.APPLICATION_JSON).body(errorMap);
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(buildUserResponse(user));
    }

    private Map<String, Object> buildUserResponse(User user) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("fullName", user.getFullName());
        map.put("username", user.getUsername());
        map.put("email", user.getEmail());
        map.put("role", user.getRole() != null ? user.getRole().name() : "");
        map.put("universityName", user.getUniversityName());
        map.put("department", user.getDepartment());
        map.put("studentNumber", user.getStudentNumber());
        map.put("institutionName", user.getInstitutionName());
        map.put("title", user.getTitle());
        map.put("city", user.getCity());
        map.put("faculty", user.getFaculty());
        map.put("phone", user.getPhone());
        map.put("linkedin", user.getLinkedIn());
        map.put("github", user.getGithub());
        map.put("twitter", user.getTwitter());
        map.put("portfolio", user.getPortfolio());
        map.put("address", user.getAddress());
        map.put("graduationInfo", user.getGraduationInfo());
        map.put("summary", user.getSummary());
        map.put("skills", user.getSkills());
        map.put("languages", user.getLanguages());
        map.put("hobbies", user.getHobbies());
        map.put("experience", user.getExperience());
        map.put("projects", user.getProjects());
        map.put("certificates", user.getCertificates());
        map.put("photoBase64", user.getPhotoBase64());
        return map;
    }
}