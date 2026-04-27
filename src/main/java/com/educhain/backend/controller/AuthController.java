package com.educhain.backend.controller;

import com.educhain.backend.dto.AuthResponse;
import com.educhain.backend.dto.LoginRequest;
import com.educhain.backend.dto.LoginResponse;
import com.educhain.backend.dto.RegisterEmployerRequest;
import com.educhain.backend.dto.RegisterUniversityRequest;
import com.educhain.backend.model.User;
import com.educhain.backend.repository.UserRepository;
import com.educhain.backend.service.BlockchainService;
import com.educhain.backend.service.JwtService;
import com.educhain.backend.service.VerificationService;
import com.educhain.backend.util.PdfHashUtil;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final VerificationService verificationService;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService,
                          VerificationService verificationService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.verificationService = verificationService;
    }

    // ─── MEZUN KAYIT ────────────────────────────────────────────────────────────
    // ✅ YENİ: multipart/form-data olarak değiştirildi (PDF yükleme için)
    @PostMapping(value = "/register/graduate", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AuthResponse> registerGraduate(
            @RequestParam("fullName") String fullName,
            @RequestParam("username") String username,
            @RequestParam("email") String email,
            @RequestParam("universityName") String universityName,
            @RequestParam("department") String department,
            @RequestParam("studentNumber") String studentNumber,
            @RequestParam("password") String password,
            @RequestParam(value = "diplomaFile", required = false) MultipartFile diplomaFile
    ) {
        // Zorunlu alan kontrolü
        if (fullName == null || fullName.isBlank() ||
                username == null || username.isBlank() ||
                email == null || email.isBlank() ||
                universityName == null || universityName.isBlank() ||
                department == null || department.isBlank() ||
                studentNumber == null || studentNumber.isBlank() ||
                password == null || password.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse("ERROR", "Lütfen tüm mezun kayıt alanlarını doldurun."));
        }

        if (userRepository.existsByEmail(email.trim())) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse("ERROR", "Bu e-posta ile kayıtlı bir kullanıcı zaten var."));
        }

        if (userRepository.existsByUsername(username.trim())) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse("ERROR", "Bu kullanıcı adı zaten kullanılıyor."));
        }

        // ✅ YENİ: Diploma PDF yüklendiyse blockchain'de doğrula
        String diplomaHash = null;
        if (diplomaFile != null && !diplomaFile.isEmpty()) {
            try {
                // PDF'den hash üret
                String hash = PdfHashUtil.hash(diplomaFile);
                String cleanHash = hash.startsWith("0x") || hash.startsWith("0X")
                        ? hash.substring(2) : hash;

                // Blockchain'de sorgula
                String result = verificationService.verifyHash(cleanHash);

                if ("GEÇERLİ".equals(result)) {
                    // Hash blockchain'de var → kaydet
                    diplomaHash = cleanHash;
                } else {
                    // Hash blockchain'de yok → hata döndür
                    return ResponseEntity.badRequest()
                            .body(new AuthResponse("ERROR",
                                    "Diploma blockchain'de doğrulanamadı. Lütfen geçerli diploma PDF'inizi yükleyin."));
                }
            } catch (Exception e) {
                return ResponseEntity.badRequest()
                        .body(new AuthResponse("ERROR", "Diploma işlenirken hata oluştu: " + e.getMessage()));
            }
        }

        // Kullanıcıyı kaydet
        User user = new User();
        user.setFullName(fullName.trim());
        user.setUsername(username.trim());
        user.setEmail(email.trim());
        user.setPassword(passwordEncoder.encode(password.trim()));
        user.setRole(User.Role.GRADUATE);
        user.setUniversityName(universityName.trim());
        user.setDepartment(department.trim());
        user.setStudentNumber(studentNumber.trim());

        // ✅ YENİ: diplomaHash varsa kaydet
        if (diplomaHash != null) {
            user.setDiplomaHash(diplomaHash);
        }

        userRepository.save(user);

        String message = diplomaHash != null
                ? "Mezun kaydı başarıyla oluşturuldu. Diplomanız blockchain'de doğrulandı! ✅"
                : "Mezun kaydı başarıyla oluşturuldu.";

        return ResponseEntity.ok(new AuthResponse("SUCCESS", message));
    }

    // ─── İŞVEREN KAYIT ──────────────────────────────────────────────────────────
    @PostMapping("/register/employer")
    public ResponseEntity<AuthResponse> registerEmployer(@RequestBody RegisterEmployerRequest request) {

        if (request.getInstitutionName() == null || request.getInstitutionName().isBlank() ||
                request.getEmail() == null || request.getEmail().isBlank() ||
                request.getPassword() == null || request.getPassword().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse("ERROR", "Lütfen tüm işveren kayıt alanlarını doldurun."));
        }

        if (userRepository.existsByEmail(request.getEmail().trim())) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse("ERROR", "Bu e-posta ile kayıtlı bir kullanıcı zaten var."));
        }

        User user = new User();
        user.setFullName(request.getInstitutionName().trim());
        user.setEmail(request.getEmail().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword().trim()));
        user.setRole(User.Role.EMPLOYER);
        user.setInstitutionName(request.getInstitutionName().trim());

        userRepository.save(user);

        return ResponseEntity.ok(new AuthResponse("SUCCESS", "İşveren kaydı başarıyla oluşturuldu."));
    }

    // ─── ÜNİVERSİTE KAYIT ───────────────────────────────────────────────────────
    @PostMapping("/register/university")
    public ResponseEntity<AuthResponse> registerUniversity(@RequestBody RegisterUniversityRequest request) {

        if (request.getUniversityName() == null || request.getUniversityName().isBlank() ||
                request.getEmail() == null || request.getEmail().isBlank() ||
                request.getPassword() == null || request.getPassword().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse("ERROR", "Lütfen tüm üniversite kayıt alanlarını doldurun."));
        }

        if (userRepository.existsByEmail(request.getEmail().trim())) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse("ERROR", "Bu e-posta ile kayıtlı bir kullanıcı zaten var."));
        }

        User user = new User();
        user.setFullName(request.getUniversityName().trim());
        user.setEmail(request.getEmail().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword().trim()));
        user.setRole(User.Role.UNIVERSITY);
        user.setUniversityName(request.getUniversityName().trim());

        userRepository.save(user);

        return ResponseEntity.ok(new AuthResponse("SUCCESS", "Üniversite kaydı başarıyla oluşturuldu."));
    }

    // ─── GİRİŞ ──────────────────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {

        if (request.getIdentifier() == null || request.getIdentifier().isBlank() ||
                request.getPassword() == null || request.getPassword().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new LoginResponse("ERROR", "Lütfen giriş bilgilerinizi doldurun.", null, null, null, null));
        }

        String identifier = request.getIdentifier().trim();
        String rawPassword = request.getPassword().trim();

        Optional<User> userOpt = userRepository.findByEmailOrUsername(identifier, identifier);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new LoginResponse("ERROR", "Kullanıcı bulunamadı.", null, null, null, null));
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            return ResponseEntity.badRequest()
                    .body(new LoginResponse("ERROR", "Şifre hatalı.", null, null, null, null));
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());

        return ResponseEntity.ok(
                new LoginResponse(
                        "SUCCESS",
                        "Giriş başarılı.",
                        user.getRole().name(),
                        user.getFullName(),
                        user.getEmail(),
                        token
                )
        );
    }
}