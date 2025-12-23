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

    // 🔎 FRONTEND → HASH DOĞRULAMA
    @PostMapping("/verify")
    public ResponseEntity<VerifyResponse> verify(@RequestBody VerifyRequest request) {

        String result = verificationService.verifyHash(request.getHash());

        return ResponseEntity.ok(
                new VerifyResponse(result)
        );
    }

    // 🔗 BLOCKCHAIN PING (TEST)
    @GetMapping("/blockchain/ping")
    public ResponseEntity<String> pingBlockchain() {
        boolean ok = verificationService.pingBlockchain();
        return ResponseEntity.ok(ok ? "BLOCKCHAIN_OK" : "BLOCKCHAIN_FAIL");
    }
}
