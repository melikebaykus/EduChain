package com.educhain.backend.repository;

import com.educhain.backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByUniversityNameAndDepartmentAndStudentNumber(
            String universityName,
            String department,
            String studentNumber
    );

    Optional<Student> findByStudentNumber(String studentNumber);

    Optional<Student> findByWalletAddress(String walletAddress);

    @Query("SELECT DISTINCT s.universityName FROM Student s ORDER BY s.universityName ASC")
    List<String> findDistinctUniversityNames();

    @Query("SELECT DISTINCT s.department FROM Student s WHERE s.universityName = :universityName ORDER BY s.department ASC")
    List<String> findDistinctDepartmentsByUniversityName(String universityName);
}