package com.educhain.backend.service;

import com.educhain.backend.dto.IssueCertificateResponse;
import com.educhain.backend.model.Student;
import com.educhain.backend.model.User;
import com.educhain.backend.repository.StudentRepository;
import com.educhain.backend.repository.UserRepository;
import com.educhain.backend.util.PdfHashUtil;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@Service
public class UniversityIssueService {

    private final StudentRepository studentRepository;
    private final BlockchainService blockchainService;
    private final UserRepository userRepository;

    public UniversityIssueService(StudentRepository studentRepository,
                                  BlockchainService blockchainService,
                                  UserRepository userRepository) {
        this.studentRepository = studentRepository;
        this.blockchainService = blockchainService;
        this.userRepository = userRepository;
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

            // ✅ util.PdfHashUtil kullan — 0x EKLEMİYOR, tutarlı
            String hash = PdfHashUtil.hash(file);

            // ✅ Garantili: 0x yoksa sorun çıkmaz, varsa temizle
            String cleanHash = hash.startsWith("0x") || hash.startsWith("0X")
                    ? hash.substring(2)
                    : hash;

            String txHash = blockchainService.issueCertificateOnChain(cleanHash, student.getWalletAddress());

            // ✅ YENİ: Hash'i User tablosuna kaydet
            Optional<User> userOpt = userRepository.findByStudentNumber(student.getStudentNumber());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                user.setDiplomaHash(cleanHash);
                userRepository.save(user);
            }

            return new IssueCertificateResponse(
                    "BAŞARILI – diploma blockchain'e yazıldı",
                    student.getStudentName(),
                    student.getStudentNumber(),
                    student.getWalletAddress(),
                    cleanHash,
                    txHash
            );

        } catch (Exception e) {
            return new IssueCertificateResponse(
                    "HATA – " + e.getMessage(), null, studentNumber, null, null, null
            );
        }
    }
}