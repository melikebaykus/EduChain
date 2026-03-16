package com.educhain.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.FunctionReturnDecoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Bool;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.generated.Bytes32;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.Transaction;
import org.web3j.protocol.core.methods.response.EthCall;
import org.web3j.protocol.core.methods.response.EthSendTransaction;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.RawTransactionManager;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class BlockchainService {

    private final Web3j web3j;
    private final String contractAddress;
    private final Credentials credentials;

    public BlockchainService(
            @Value("${educhain.web3.rpc}") String rpcUrl,
            @Value("${educhain.contract.address}") String contractAddress,
            @Value("${educhain.issuer.private-key}") String privateKey
    ) {
        this.web3j = Web3j.build(new HttpService(rpcUrl));
        this.contractAddress = contractAddress;
        this.credentials = Credentials.create(privateKey);
    }

    // Blockchain bağlantı testi
    public boolean pingBlockchain() {
        try {
            return web3j.web3ClientVersion().send().getWeb3ClientVersion() != null;
        } catch (Exception e) {
            return false;
        }
    }

    // issueCertificate(bytes32 certificateHash, address student)
    public String issueCertificateOnChain(String pdfHashHex, String studentAddress) throws Exception {
        byte[] hashBytes32 = hexToBytes32(pdfHashHex);

        Function function = new Function(
                "issueCertificate",
                Arrays.asList(
                        new Bytes32(hashBytes32),
                        new Address(studentAddress)
                ),
                Collections.emptyList()
        );

        String encodedFunction = FunctionEncoder.encode(function);

        RawTransactionManager txManager = new RawTransactionManager(web3j, credentials);

        BigInteger gasPrice = web3j.ethGasPrice().send().getGasPrice();
        BigInteger gasLimit = BigInteger.valueOf(300_000);

        EthSendTransaction tx = txManager.sendTransaction(
                gasPrice,
                gasLimit,
                contractAddress,
                encodedFunction,
                BigInteger.ZERO
        );

        if (tx == null) {
            throw new RuntimeException("Blockchain işlemi gönderilemedi.");
        }

        if (tx.hasError()) {
            throw new RuntimeException("Blockchain TX error: " + tx.getError().getMessage());
        }

        return tx.getTransactionHash();
    }

    // verifyCertificate(bytes32 certificateHash)
    // returns (address university, address student, uint256 issuedAt, bool isValid)
    public VerifyResult verifyCertificateOnChain(String pdfHashHex) throws Exception {
        byte[] certificateHash32 = hexToBytes32(pdfHashHex);

        Function function = new Function(
                "verifyCertificate",
                Collections.singletonList(new Bytes32(certificateHash32)),
                Arrays.asList(
                        new TypeReference<Address>() {},   // university
                        new TypeReference<Address>() {},   // student
                        new TypeReference<Uint256>() {},   // issuedAt
                        new TypeReference<Bool>() {}       // isValid
                )
        );

        String encoded = FunctionEncoder.encode(function);

        Transaction ethCallTransaction = Transaction.createEthCallTransaction(
                credentials.getAddress(),
                contractAddress,
                encoded
        );

        EthCall ethCall = web3j.ethCall(ethCallTransaction, DefaultBlockParameterName.LATEST).send();

        if (ethCall == null) {
            return new VerifyResult(false, null, null, 0L, false);
        }

        if (ethCall.isReverted()) {
            return new VerifyResult(false, null, null, 0L, false);
        }

        String value = ethCall.getValue();

        if (value == null || "0x".equals(value)) {
            return new VerifyResult(false, null, null, 0L, false);
        }

        List<org.web3j.abi.datatypes.Type> decoded =
                FunctionReturnDecoder.decode(value, function.getOutputParameters());

        if (decoded == null || decoded.size() < 4) {
            return new VerifyResult(false, null, null, 0L, false);
        }

        String universityAddress = ((Address) decoded.get(0)).getValue();
        String studentAddress = ((Address) decoded.get(1)).getValue();
        BigInteger issuedAt = ((Uint256) decoded.get(2)).getValue();
        Boolean isValid = ((Bool) decoded.get(3)).getValue();

        boolean exists =
                universityAddress != null &&
                        !universityAddress.equalsIgnoreCase("0x0000000000000000000000000000000000000000");

        return new VerifyResult(
                exists,
                universityAddress,
                studentAddress,
                issuedAt != null ? issuedAt.longValue() : 0L,
                Boolean.TRUE.equals(isValid)
        );
    }

    public static class VerifyResult {
        public boolean exists;
        public String universityAddress;
        public String studentAddress;
        public long issuedAt;
        public boolean isValid;

        public VerifyResult(boolean exists, String universityAddress, String studentAddress, long issuedAt, boolean isValid) {
            this.exists = exists;
            this.universityAddress = universityAddress;
            this.studentAddress = studentAddress;
            this.issuedAt = issuedAt;
            this.isValid = isValid;
        }
    }

    public static byte[] hexToBytes32(String hex) {
        if (hex == null || hex.isBlank()) {
            throw new IllegalArgumentException("Hash boş olamaz.");
        }

        String clean = hex.trim();
        if (clean.startsWith("0x") || clean.startsWith("0X")) {
            clean = clean.substring(2);
        }

        if (clean.length() != 64) {
            throw new IllegalArgumentException("Hash 64 hex karakter olmalı. Gelen uzunluk: " + clean.length());
        }

        if (!clean.matches("[0-9a-fA-F]{64}")) {
            throw new IllegalArgumentException("Hash sadece hexadecimal karakter içermeli.");
        }

        byte[] out = new byte[32];
        for (int i = 0; i < 32; i++) {
            int index = i * 2;
            out[i] = (byte) Integer.parseInt(clean.substring(index, index + 2), 16);
        }
        return out;
    }
}