package com.educhain.backend.controller;

import com.educhain.backend.dto.VerifyRequest;
import com.educhain.backend.dto.VerifyResponse;
import com.educhain.backend.service.VerificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    // ✅ FRONTEND → VERIFY
    @PostMapping("/verify")
    public ResponseEntity<VerifyResponse> verify(@RequestBody VerifyRequest request) {

        String result = verificationService.verifyHash(request.getHash());

        // 🔥 BURASI KRİTİK: String → VerifyResponse
        VerifyResponse response = new VerifyResponse(result);

        return ResponseEntity.ok(response);
    }
}
