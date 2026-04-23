package com.educhain.backend.config;

import com.educhain.backend.model.Student;
import com.educhain.backend.repository.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final StudentRepository studentRepository;

    public DataLoader(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public void run(String... args) {

        if (studentRepository.count() == 0) {

            Student s1 = new Student();
            s1.setStudentName("Melike Rabia BAYKUŞ");
            s1.setStudentNumber("2021001");
            // ✅ Türkçe — frontend ile birebir eşleşmeli
            s1.setDepartment("Bilgisayar Mühendisliği");
            s1.setUniversityName("Erzurum Teknik Üniversitesi");
            s1.setWalletAddress("0xb1c0b8dae6fcc7e32616ae61c77af7a4ee1cb7cd");

            Student s2 = new Student();
            s2.setStudentName("Nisa Nur İSTEMİHAN");
            s2.setStudentNumber("2021002");
            // ✅ Türkçe — frontend ile birebir eşleşmeli
            s2.setDepartment("Yazılım Mühendisliği");
            s2.setUniversityName("Erzurum Teknik Üniversitesi");
            s2.setWalletAddress("0x5DBB002c51869A32d69Df249B692Cde533131056");

            studentRepository.save(s1);
            studentRepository.save(s2);
        }
    }
}