package com.educhain.backend.util;

import org.springframework.web.multipart.MultipartFile;

import java.security.MessageDigest;

public class PdfHashUtil {

    public static String hash(MultipartFile file) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(file.getBytes());

            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }

            return hexString.toString();

        } catch (Exception e) {
            throw new RuntimeException("PDF hash oluşturulamadı", e);
        }
    }
}
