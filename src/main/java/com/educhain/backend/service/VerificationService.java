package com.educhain.backend.service;

import com.educhain.backend.model.Student;
import com.educhain.backend.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.security.MessageDigest;
import java.util.Optional;

@Service
public class VerificationService {

    private final BlockchainService blockchainService;
    private final StudentRepository studentRepository;

    public VerificationService(BlockchainService blockchainService, StudentRepository studentRepository) {
        this.blockchainService = blockchainService;
        this.studentRepository = studentRepository;
    }

    public String verifyHash(String hashHex) {

        if (hashHex == null || hashHex.isBlank()) {
            return "GEÇERSİZ – hash boş";
        }

        try {
            hashHex = hashHex.trim();

            if (hashHex.startsWith("0x") || hashHex.startsWith("0X")) {
                hashHex = hashHex.substring(2);
            }

            if (hashHex.length() != 64) {
                return "GEÇERSİZ – hash 64 hex değil";
            }

            BlockchainService.VerifyResult result =
                    blockchainService.verifyCertificateOnChain(hashHex);

            if (!result.exists) return "GEÇERSİZ";
            if (!result.isValid) return "GEÇERSİZ";

            return "GEÇERLİ";

        } catch (Exception e) {
            e.printStackTrace();
            return "HATA";
        }
    }

    public String verifyPdfWithStudentInfo(
            MultipartFile file,
            String universityName,
            String department,
            String studentNumber
    ) {

        try {
            if (file == null || file.isEmpty()) {
                return "GEÇERSİZ – PDF yüklenmedi";
            }

            if (universityName == null || universityName.isBlank()) {
                return "GEÇERSİZ – üniversite bilgisi boş";
            }

            if (department == null || department.isBlank()) {
                return "GEÇERSİZ – bölüm bilgisi boş";
            }

            if (studentNumber == null || studentNumber.isBlank()) {
                return "GEÇERSİZ – öğrenci numarası boş";
            }

            Optional<Student> studentOpt =
                    studentRepository.findByUniversityNameAndDepartmentAndStudentNumber(
                            universityName.trim(),
                            department.trim(),
                            studentNumber.trim()
                    );

            if (studentOpt.isEmpty()) {
                return "GEÇERSİZ – öğrenci kaydı bulunamadı";
            }

            Student student = studentOpt.get();
            String walletAddress = student.getWalletAddress();

            if (walletAddress == null || walletAddress.isBlank()) {
                return "GEÇERSİZ – öğrenci cüzdan adresi bulunamadı";
            }

            String pdfHash = generateSha256Hex(file.getBytes());

            BlockchainService.VerifyResult result =
                    blockchainService.verifyCertificateOnChain(pdfHash.substring(2));

            if (!result.exists) {
                return "GEÇERSİZ – blockchain kaydı yok";
            }

            if (!result.isValid) {
                return "GEÇERSİZ – sertifika iptal edilmiş";
            }

            if (result.studentAddress == null ||
                    !result.studentAddress.equalsIgnoreCase(walletAddress.trim())) {
                return "GEÇERSİZ – mezun bilgileri ile blockchain adresi eşleşmiyor";
            }

            return "GEÇERLİ";

        } catch (Exception e) {
            e.printStackTrace();
            return "HATA";
        }
    }

    private String generateSha256Hex(byte[] fileBytes) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hashBytes = digest.digest(fileBytes);

        StringBuilder hex = new StringBuilder("0x");

        for (byte b : hashBytes) {
            hex.append(String.format("%02x", b));
        }

        return hex.toString();
    }

    public boolean pingBlockchain() {
        return blockchainService.pingBlockchain();
    }
}