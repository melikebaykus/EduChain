// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*
    EduChain
    Diploma & Certificate Verification System

    ⚠ Blockchain stores ONLY hashes (bytes32), not PDF files
*/

import "@openzeppelin/contracts/access/AccessControl.sol";

contract EduChain is AccessControl {

    // ================= ROLES =================
    bytes32 public constant UNIVERSITY_ROLE = keccak256("UNIVERSITY_ROLE");

    // ================= DATA MODEL =================
    struct Certificate {
        address university;   // Issuer university
        address student;      // Graduate
        uint256 issuedAt;     // Timestamp
        bool isValid;         // Revoked or not
        bool exists;          // Prevent duplicates
    }

    // certificateHash => Certificate
    mapping(bytes32 => Certificate) private certificates;

    // ================= EVENTS =================
    event UniversityAdded(address indexed university);
    event UniversityRemoved(address indexed university);

    event CertificateIssued(
        bytes32 indexed certificateHash,
        address indexed university,
        address indexed student
    );

    event CertificateRevoked(
        bytes32 indexed certificateHash,
        address indexed university
    );

    // ================= CONSTRUCTOR =================
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
        // ================= UNIVERSITY MANAGEMENT =================

    function addUniversity(address university)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        grantRole(UNIVERSITY_ROLE, university);
        emit UniversityAdded(university);
    }

    function removeUniversity(address university)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        revokeRole(UNIVERSITY_ROLE, university);
        emit UniversityRemoved(university);
    }

        // ================= CERTIFICATE ISSUING =================

    function issueCertificate(
        bytes32 certificateHash,
        address student
    )
        external
        onlyRole(UNIVERSITY_ROLE)
    {
        require(!certificates[certificateHash].exists, "Certificate already exists");

        certificates[certificateHash] = Certificate({
            university: msg.sender,
            student: student,
            issuedAt: block.timestamp,
            isValid: true,
            exists: true
        });

        emit CertificateIssued(certificateHash, msg.sender, student);
    }

        // ================= VERIFICATION =================

    function verifyCertificate(bytes32 certificateHash)
        external
        view
        returns (
            address university,
            address student,
            uint256 issuedAt,
            bool isValid
        )
    {
        require(certificates[certificateHash].exists, "Certificate not found");

        Certificate memory cert = certificates[certificateHash];

        return (
            cert.university,
            cert.student,
            cert.issuedAt,
            cert.isValid
        );
    }
        // ================= REVOCATION =================

    function revokeCertificate(bytes32 certificateHash)
        external
        onlyRole(UNIVERSITY_ROLE)
    {
        require(certificates[certificateHash].exists, "Certificate not found");
        require(certificates[certificateHash].isValid, "Already revoked");

        certificates[certificateHash].isValid = false;

        emit CertificateRevoked(certificateHash, msg.sender);
    }




}

