package com.educhain.backend.service;

import com.educhain.backend.model.Certificate;
import com.educhain.backend.repository.CertificateRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class CertificateService {

    private final CertificateRepository certificateRepository;

    public CertificateService(CertificateRepository certificateRepository) {
        this.certificateRepository = certificateRepository;
    }

    public Certificate uploadAndSave(
            MultipartFile pdf,
            String studentName,
            String studentNumber,
            String universityName,
            String department,
            String degree
    ) {

        // 🔐 PDF'den HASH ÜRET (config'ten SHA-256 okunuyor)
        String pdfHash = PdfHashUtil.hash(pdf);

        Certificate certificate = new Certificate();
        certificate.setStudentName(studentName);
        certificate.setStudentNumber(studentNumber);
        certificate.setUniversityName(universityName);
        certificate.setDepartment(department);
        certificate.setDegree(degree);

        // ❌ TEMP_HASH YOK → ✅ GERÇEK HASH
        certificate.setDiplomaHash(pdfHash);

        return certificateRepository.save(certificate);
    }
}
