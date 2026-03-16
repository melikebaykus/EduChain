package com.educhain.backend.service;

import com.educhain.backend.dto.IssueCertificateResponse;
import com.educhain.backend.model.Student;
import com.educhain.backend.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.security.MessageDigest;
import java.util.Optional;

@Service
public class UniversityIssueService {

    private final StudentRepository studentRepository;
    private final BlockchainService blockchainService;

    public UniversityIssueService(StudentRepository studentRepository, BlockchainService blockchainService) {
        this.studentRepository = studentRepository;
        this.blockchainService = blockchainService;
    }

    public IssueCertificateResponse issueCertificate(MultipartFile file, String studentNumber) {
        try {
            if (file == null || file.isEmpty()) {
                return new IssueCertificateResponse(
                        "GEÇERSİZ – PDF yüklenmedi", null, studentNumber, null, null, null
                );
            }

            if (studentNumber == null || studentNumber.isBlank()) {
                return new IssueCertificateResponse(
                        "GEÇERSİZ – öğrenci numarası boş", null, null, null, null, null
                );
            }

            Optional<Student> optionalStudent = studentRepository.findByStudentNumber(studentNumber.trim());

            if (optionalStudent.isEmpty()) {
                return new IssueCertificateResponse(
                        "GEÇERSİZ – öğrenci bulunamadı", null, studentNumber, null, null, null
                );
            }

            Student student = optionalStudent.get();

            String hash = generateSha256Hex(file.getBytes());

            String txHash = blockchainService.issueCertificateOnChain(hash, student.getWalletAddress());

            return new IssueCertificateResponse(
                    "BAŞARILI – diploma blockchain'e yazıldı",
                    student.getStudentName(),
                    student.getStudentNumber(),
                    student.getWalletAddress(),
                    hash,
                    txHash
            );

        } catch (Exception e) {
            return new IssueCertificateResponse(
                    "HATA – " + e.getMessage(), null, studentNumber, null, null, null
            );
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
}