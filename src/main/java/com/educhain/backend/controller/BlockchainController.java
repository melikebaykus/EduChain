package com.educhain.backend.controller;

import com.educhain.backend.service.BlockchainService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/blockchain")
@CrossOrigin(origins = "*")
public class BlockchainController {

    private final BlockchainService blockchainService;

    public BlockchainController(BlockchainService blockchainService) {
        this.blockchainService = blockchainService;
    }

    @GetMapping("/ping")
    public Map<String, Object> ping() {
        boolean ok = blockchainService.pingBlockchain();
        return Map.of(
                "success", ok,
                "message", ok ? "Blockchain bağlantısı başarılı" : "Blockchain bağlantısı başarısız"
        );
    }

    @PostMapping("/verify")
    public Map<String, Object> verify(@RequestBody Map<String, String> request) throws Exception {
        String hash = request.get("hash");

        BlockchainService.VerifyResult result = blockchainService.verifyCertificateOnChain(hash);

        return Map.of(
                "exists", result.exists,
                "universityAddress", result.universityAddress == null ? "" : result.universityAddress,
                "studentAddress", result.studentAddress == null ? "" : result.studentAddress,
                "issuedAt", result.issuedAt,
                "isValid", result.isValid
        );
    }

    @PostMapping("/issue")
    public Map<String, Object> issue(@RequestBody Map<String, String> request) throws Exception {
        String hash = request.get("hash");
        String studentAddress = request.get("studentAddress");

        String txHash = blockchainService.issueCertificateOnChain(hash, studentAddress);

        return Map.of(
                "success", true,
                "transactionHash", txHash
        );
    }
}