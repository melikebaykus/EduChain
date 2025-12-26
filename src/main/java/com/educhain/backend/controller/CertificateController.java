package com.educhain.backend.controller;

import com.educhain.backend.dto.UploadCertificateResponse;
import com.educhain.backend.service.CertificateService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/certificates")
@CrossOrigin(origins = "*")
public class CertificateController {

    private final CertificateService certificateService;

    public CertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    // ✅ PDF → HASH → BLOCKCHAIN → TX HASH
    @PostMapping("/upload")
    public ResponseEntity<UploadCertificateResponse> upload(
            @RequestParam("pdf") MultipartFile pdf,
            @RequestParam("studentWallet") String studentWallet
    ) throws Exception {

        String transactionHash =
                certificateService.uploadAndWriteToBlockchain(
                        pdf,
                        studentWallet
                );

        return ResponseEntity.ok(
                new UploadCertificateResponse(transactionHash)
        );
    }
}
