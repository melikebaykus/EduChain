package com.educhain.backend.controller;

import com.educhain.backend.dto.AuthResponse;
import com.educhain.backend.dto.LoginRequest;
import com.educhain.backend.dto.LoginResponse;
import com.educhain.backend.dto.RegisterEmployerRequest;
import com.educhain.backend.dto.RegisterGraduateRequest;
import com.educhain.backend.model.User;
import com.educhain.backend.repository.UserRepository;
import com.educhain.backend.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register/graduate")
    public ResponseEntity<AuthResponse> registerGraduate(@RequestBody RegisterGraduateRequest request) {

        if (request.getFullName() == null || request.getFullName().isBlank() ||
                request.getUsername() == null || request.getUsername().isBlank() ||
                request.getEmail() == null || request.getEmail().isBlank() ||
                request.getUniversityName() == null || request.getUniversityName().isBlank() ||
                request.getDepartment() == null || request.getDepartment().isBlank() ||
                request.getStudentNumber() == null || request.getStudentNumber().isBlank() ||
                request.getPassword() == null || request.getPassword().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse("ERROR", "Lütfen tüm mezun kayıt alanlarını doldurun."));
        }

        if (userRepository.existsByEmail(request.getEmail().trim())) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse("ERROR", "Bu e-posta ile kayıtlı bir kullanıcı zaten var."));
        }

        if (userRepository.existsByUsername(request.getUsername().trim())) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse("ERROR", "Bu kullanıcı adı zaten kullanılıyor."));
        }

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setUsername(request.getUsername().trim());
        user.setEmail(request.getEmail().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword().trim()));
        user.setRole(User.Role.GRADUATE);
        user.setUniversityName(request.getUniversityName().trim());
        user.setDepartment(request.getDepartment().trim());
        user.setStudentNumber(request.getStudentNumber().trim());

        userRepository.save(user);

        return ResponseEntity.ok(new AuthResponse("SUCCESS", "Mezun kaydı başarıyla oluşturuldu."));
    }

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
        user.setUsername(null);
        user.setEmail(request.getEmail().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword().trim()));
        user.setRole(User.Role.EMPLOYER);
        user.setInstitutionName(request.getInstitutionName().trim());

        userRepository.save(user);

        return ResponseEntity.ok(new AuthResponse("SUCCESS", "İşveren kaydı başarıyla oluşturuldu."));
    }

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