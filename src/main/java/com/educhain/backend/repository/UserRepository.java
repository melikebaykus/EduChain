package com.educhain.backend.repository;

import com.educhain.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    Optional<User> findByEmailOrUsername(String email, String username);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    // ✅ YENİ: öğrenci numarasına göre user bul
    Optional<User> findByStudentNumber(String studentNumber);
}