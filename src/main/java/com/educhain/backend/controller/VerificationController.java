package com.educhain.backend.controller;

import com.educhain.backend.dto.VerifyRequest;
import com.educhain.backend.dto.VerifyResponse;
import com.educhain.backend.service.VerificationService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@CrossOrigin(
        origins = "*",
        allowedHeaders = "*",
        methods = {RequestMethod.POST, RequestMethod.GET, RequestMethod.OPTIONS}
)
public class VerificationController {

    private final VerificationService verificationService;

    public VerificationController(VerificationService verificationService) {
        this.verificationService = verificationService;
    }

    @PostMapping("/verify")
    public ResponseEntity<VerifyResponse> verify(@RequestBody VerifyRequest request) {
        String result = verificationService.verifyHash(request.getHash());
        // ✅ YENİ: Frontend { valid: boolean } bekliyor
        boolean isValid = "GEÇERLİ".equals(result);
        return ResponseEntity.ok(new VerifyResponse(isValid, result));
    }

    @PostMapping(
            value = "/verify-pdf",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<VerifyResponse> verifyPdf(
            @RequestParam("file") MultipartFile file,
            @RequestParam("universityName") String universityName,
            @RequestParam("department") String department,
            @RequestParam("studentNumber") String studentNumber
    ) {
        String result = verificationService.verifyPdfWithStudentInfo(
                file,
                universityName,
                department,
                studentNumber
        );

        boolean isValid = "GEÇERLİ".equals(result);
        return ResponseEntity.ok(new VerifyResponse(isValid, result));
    }
}