package com.educhain.backend.service;

import org.springframework.stereotype.Service;

@Service
public class VerificationService {

    public String verifyHash(String hash) {

        // 🔴 ŞİMDİLİK SİMÜLASYON
        if (hash == null || hash.isEmpty()) {
            return "INVALID";
        }

        if (hash.equals("123")) {
            return "VALID";
        }

        if (hash.equals("456")) {
            return "REVOKED";
        }

        return "INVALID";
    }
}
