package com.educhain.backend.controller;

import com.educhain.backend.service.StudentLookupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentLookupController {

    private final StudentLookupService studentLookupService;

    public StudentLookupController(StudentLookupService studentLookupService) {
        this.studentLookupService = studentLookupService;
    }

    @GetMapping("/universities")
    public ResponseEntity<List<String>> getUniversities() {
        return ResponseEntity.ok(studentLookupService.getUniversities());
    }

    @GetMapping("/departments")
    public ResponseEntity<List<String>> getDepartmentsByUniversity(
            @RequestParam("universityName") String universityName
    ) {
        return ResponseEntity.ok(studentLookupService.getDepartmentsByUniversity(universityName));
    }
}