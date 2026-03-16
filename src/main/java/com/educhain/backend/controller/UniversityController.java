package com.educhain.backend.controller;

import com.educhain.backend.dto.IssueCertificateResponse;
import com.educhain.backend.service.UniversityIssueService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/university")
@CrossOrigin(origins = "*")
public class UniversityController {

    private final UniversityIssueService universityIssueService;

    public UniversityController(UniversityIssueService universityIssueService) {
        this.universityIssueService = universityIssueService;
    }

    @PostMapping(value = "/issue-pdf", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<IssueCertificateResponse> issuePdf(
            @RequestParam("file") MultipartFile file,
            @RequestParam("studentNumber") String studentNumber
    ) {
        IssueCertificateResponse response = universityIssueService.issueCertificate(file, studentNumber);
        return ResponseEntity.ok(response);
    }
}