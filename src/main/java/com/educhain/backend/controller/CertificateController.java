package com.educhain.backend.controller;

import com.educhain.backend.dto.UploadCertificateResponse;
import com.educhain.backend.model.Certificate;
import com.educhain.backend.service.CertificateService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    private final CertificateService certificateService;

    public CertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    @PostMapping("/upload")
    public ResponseEntity<UploadCertificateResponse> upload(
            @RequestParam("pdf") MultipartFile pdf,
            @RequestParam("studentName") String studentName,
            @RequestParam("studentNumber") String studentNumber,
            @RequestParam("universityName") String universityName,
            @RequestParam("department") String department,
            @RequestParam("degree") String degree
    ) throws Exception {

        Certificate saved = certificateService.uploadAndSave(
                pdf, studentName, studentNumber, universityName, department, degree
        );

        return ResponseEntity.ok(new UploadCertificateResponse(saved.getId(), saved.getDiplomaHash()));
    }
}
