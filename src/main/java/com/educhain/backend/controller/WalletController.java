package com.educhain.backend.controller;

import com.educhain.backend.dto.WalletVerifyRequest;
import com.educhain.backend.model.User;
import com.educhain.backend.repository.UserRepository;
import com.educhain.backend.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.web3j.crypto.Keys;
import org.web3j.crypto.Sign;
import org.web3j.utils.Numeric;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.SignatureException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/wallet")
@CrossOrigin(origins = "*")
public class WalletController {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public WalletController(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @GetMapping("/challenge")
    public ResponseEntity<?> getChallenge(
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Token bulunamadı."));
        }

        String token = authHeader.substring(7);

        if (!jwtService.isTokenValid(token)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Geçersiz token."));
        }

        String email = jwtService.extractEmail(token);
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Kullanıcı bulunamadı."));
        }

        String nonce = UUID.randomUUID().toString();

        Map<String, Object> response = new HashMap<>();
        response.put("message", "EduChain wallet doğrulama isteği. Nonce: " + nonce);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyWallet(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody WalletVerifyRequest request
    ) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Token bulunamadı."));
        }

        String token = authHeader.substring(7);

        if (!jwtService.isTokenValid(token)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Geçersiz token."));
        }

        String email = jwtService.extractEmail(token);
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Kullanıcı bulunamadı."));
        }

        try {
            String recoveredAddress = recoverAddress(request.getMessage(), request.getSignature());

            if (recoveredAddress == null ||
                    !recoveredAddress.equalsIgnoreCase(request.getWalletAddress())) {
                return ResponseEntity.badRequest().body(Map.of("error", "İmza doğrulanamadı."));
            }

            User user = userOpt.get();
            user.setWalletAddress(request.getWalletAddress());
            userRepository.save(user);

            Map<String, Object> response = new HashMap<>();
            response.put("status", "OK");
            response.put("walletAddress", request.getWalletAddress());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "İmza doğrulanamadı: " + e.getMessage()));
        }
    }

    private String recoverAddress(String message, String signatureHex) throws SignatureException {
        byte[] messageBytes = message.getBytes(StandardCharsets.UTF_8);
        byte[] signatureBytes = Numeric.hexStringToByteArray(signatureHex);

        if (signatureBytes.length != 65) {
            throw new SignatureException("Geçersiz signature uzunluğu.");
        }

        byte v = signatureBytes[64];
        if (v < 27) {
            v += 27;
        }

        Sign.SignatureData signatureData = new Sign.SignatureData(
                v,
                java.util.Arrays.copyOfRange(signatureBytes, 0, 32),
                java.util.Arrays.copyOfRange(signatureBytes, 32, 64)
        );

        BigInteger publicKey = Sign.signedPrefixedMessageToKey(messageBytes, signatureData);
        return "0x" + Keys.getAddress(publicKey);
    }
}