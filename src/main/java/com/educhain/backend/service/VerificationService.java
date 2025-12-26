package com.educhain.backend.service;

import org.springframework.stereotype.Service;

@Service
public class VerificationService {

    private final BlockchainService blockchainService;

    public VerificationService(BlockchainService blockchainService) {
        this.blockchainService = blockchainService;
    }

    // 🔎 GERÇEK BLOCKCHAIN VERIFY
    public String verifyHash(String hashHex) {

        if (hashHex == null || hashHex.isBlank()) {
            return "GEÇERSİZ – hash boş";
        }

        try {
            // 🔥 EĞER 0x YOKSA EKLE
            if (!hashHex.startsWith("0x")) {
                hashHex = "0x" + hashHex;
            }

            byte[] hash32 = BlockchainService.hexToBytes32(hashHex);
            boolean exists = blockchainService.verifyCertificateOnChain(hash32);

            return exists ? "GEÇERLİ" : "GEÇERSİZ";

        } catch (Exception e) {
            e.printStackTrace();
            return "HATA";
        }
    }

    public boolean pingBlockchain() {
        return blockchainService.pingBlockchain();
    }
}
