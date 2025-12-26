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

    public String uploadAndWriteToBlockchain(
            MultipartFile pdf,
            String studentWallet
    ) throws Exception {

        String pdfHashHex = PdfHashUtil.hash(pdf);
        System.out.println("PDF HASH = " + pdfHashHex);
        System.out.println("PDF_HASH=" + pdfHashHex);



        return blockchainService.issueCertificateOnChain(
                pdfHashHex,
                studentWallet
        );
    }
}
