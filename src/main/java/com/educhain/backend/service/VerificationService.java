package com.educhain.backend.service;

import org.springframework.stereotype.Service;

@Service
public class VerificationService {

    private final BlockchainService blockchainService;

    public VerificationService(BlockchainService blockchainService) {
        this.blockchainService = blockchainService;
    }

    // 🔎 HASH DOĞRULAMA (ON-CHAIN)
    public String verifyHash(String hashHex) {

        if (hashHex == null || hashHex.isBlank()) {
            return "GEÇERSİZ – hash boş";
        }

        try {
            byte[] hash32 = BlockchainService.hexToBytes32(hashHex);
            boolean isValid = blockchainService.verifyCertificateOnChain(hash32);

            if (isValid) {
                return "GEÇERLİ";
            } else {
                return "GEÇERSİZ / BLOCKCHAIN KAYDI YOK";
            }

        } catch (Exception e) {
            return "HATA – " + e.getMessage();
        }
    }

    // 🔗 BLOCKCHAIN BAĞLANTI TESTİ
    public boolean pingBlockchain() {
        return blockchainService.pingBlockchain();
    }
}
