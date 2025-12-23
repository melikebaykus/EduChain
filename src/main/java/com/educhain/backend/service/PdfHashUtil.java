package com.educhain.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.security.MessageDigest;

@Component
public class PdfHashUtil {

    private static String hashAlgorithm;

    @Value("${educhain.hash-algorithm}")
    public void setHashAlgorithm(String algorithm) {
        hashAlgorithm = algorithm;
    }

    public static String hash(MultipartFile file) {
        try {
            MessageDigest digest = MessageDigest.getInstance(hashAlgorithm);
            byte[] hashBytes = digest.digest(file.getBytes());

            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                hexString.append(String.format("%02x", b));
            }

            return hexString.toString();

        } catch (Exception e) {
            throw new RuntimeException("PDF hash oluşturulamadı", e);
        }
    }
}
