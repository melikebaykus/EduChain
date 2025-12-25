package com.educhain.backend.util;

import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.security.MessageDigest;

public class PdfHashUtil {

    public static String hash(MultipartFile file) {
        try (InputStream inputStream = file.getInputStream()) {

            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            byte[] buffer = new byte[8192];
            int bytesRead;

            while ((bytesRead = inputStream.read(buffer)) != -1) {
                digest.update(buffer, 0, bytesRead);
            }

            byte[] hashBytes = digest.digest();

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
