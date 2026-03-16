package com.educhain.backend.service;

import com.educhain.backend.util.PdfHashUtil;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class CertificateService {

    private final BlockchainService blockchainService;

    public CertificateService(BlockchainService blockchainService) {
        this.blockchainService = blockchainService;
    }

    /**
     * 📌 PDF yüklenir
     * 📌 SHA-256 hash üretilir
     * 📌 Hash blockchain'e bytes32 olarak yazılır
     * 📌 Transaction hash döner
     */
    public String uploadAndWriteToBlockchain(
            MultipartFile pdf,
            String studentWallet
    ) throws Exception {

        // 🔐 PDF → SHA-256 HASH (64 hex char)
        String pdfHashHex = PdfHashUtil.hash(pdf);

        // ❗ GARANTİ: blockchain tarafı 0x'siz 64 hex bekliyor
        if (pdfHashHex.startsWith("0x") || pdfHashHex.startsWith("0X")) {
            pdfHashHex = pdfHashHex.substring(2);
        }

        if (pdfHashHex.length() != 64) {
            throw new IllegalStateException(
                    "PDF hash 64 hex karakter değil! Gelen: " + pdfHashHex.length()
            );
        }

        // 🔥 HASH → BLOCKCHAIN
        String txHash = blockchainService.issueCertificateOnChain(
                pdfHashHex,
                studentWallet
        );

        return txHash;
    }

    /**
     * ✅ İşveren doğrulama akışı:
     * 1) PDF -> HASH üret
     * 2) Blockchain verifyCertificate(hash) çağır
     * 3) Kayıt var mı?
     * 4) isValid true mu?
     * 5) Seçilen studentWallet ile eşleşiyor mu?
     */
    public boolean verifyAgainstStudentWallet(
            MultipartFile pdf,
            String studentWallet
    ) throws Exception {

        // 1) PDF -> HASH
        String pdfHashHex = PdfHashUtil.hash(pdf);

        if (pdfHashHex.startsWith("0x") || pdfHashHex.startsWith("0X")) {
            pdfHashHex = pdfHashHex.substring(2);
        }

        if (pdfHashHex.length() != 64) {
            throw new IllegalStateException("PDF hash 64 hex karakter değil! Gelen: " + pdfHashHex.length());
        }

        // 2) Blockchain'den detaylı doğrula
        BlockchainService.VerifyResult onChain =
                blockchainService.verifyCertificateOnChain(pdfHashHex);

        // kayıt var mı?
        if (!onChain.exists) return false;

        // isValid true mu?
        if (!onChain.isValid) return false;

        // seçilen öğrenci ile eşleşiyor mu?
        return onChain.studentAddress != null
                && onChain.studentAddress.equalsIgnoreCase(studentWallet);
    }
}