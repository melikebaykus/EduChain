package com.educhain.backend.service;

import com.educhain.backend.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentLookupService {

    private final StudentRepository studentRepository;

    public StudentLookupService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<String> getUniversities() {
        return studentRepository.findDistinctUniversityNames();
    }

    public List<String> getDepartmentsByUniversity(String universityName) {
        return studentRepository.findDistinctDepartmentsByUniversityName(universityName);
    }
}