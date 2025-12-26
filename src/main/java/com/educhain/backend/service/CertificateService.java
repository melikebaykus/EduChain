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

        // 🔎 DEBUG (çok önemli)
        System.out.println("=== UPLOAD STEP ===");
        System.out.println("PDF HASH (RAW) = " + pdfHashHex);
        System.out.println("PDF HASH LENGTH = " + pdfHashHex.length());

        // ❗ GARANTİ: blockchain tarafı 0x'siz 64 hex bekliyor
        // burada SADECE temiz hex gönderiyoruz
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

        System.out.println("BLOCKCHAIN TX HASH = " + txHash);

        return txHash;
    }
}
