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

    // ✅ RPC bağlantı testi
    public boolean pingBlockchain() {
        try {
            web3j.web3ClientVersion().send();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // 🔥 HASH → BLOCKCHAIN (issueCertificate)
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

        if (tx.hasError()) {
            throw new RuntimeException("Blockchain TX error: " + tx.getError().getMessage());
        }

        return tx.getTransactionHash();
    }

    // ✅ GERÇEK VERIFY: verifyCertificate(bytes32) -> (address,address,uint256,bool)
    public boolean verifyCertificateOnChain(byte[] certificateHash32) throws Exception {

        Function function = new Function(
                "verifyCertificate",
                Collections.singletonList(new Bytes32(certificateHash32)),
                Arrays.asList(
                        new TypeReference<Address>() {},
                        new TypeReference<Address>() {},
                        new TypeReference<Uint256>() {},
                        new TypeReference<Bool>() {}
                )
        );

        String encoded = FunctionEncoder.encode(function);

        Transaction ethCall = Transaction.createEthCallTransaction(
                null,
                contractAddress,
                encoded
        );

        String value = web3j.ethCall(ethCall, DefaultBlockParameterName.LATEST)
                .send()
                .getValue();

        List<org.web3j.abi.datatypes.Type> decoded =
                FunctionReturnDecoder.decode(value, function.getOutputParameters());

        // Eğer contract "Certificate not found" diye revert ederse decode boş gelebilir
        if (decoded == null || decoded.size() < 4) return false;

        Bool isValid = (Bool) decoded.get(3);
        return Boolean.TRUE.equals(isValid.getValue());
    }

    // ✅ Hex (64 char) → bytes32
    public static byte[] hexToBytes32(String hex) {
        if (hex == null) throw new IllegalArgumentException("Hash null olamaz");

        String clean = hex.trim();
        if (clean.startsWith("0x") || clean.startsWith("0X")) clean = clean.substring(2);

        if (clean.length() != 64) {
            throw new IllegalArgumentException("Hash 64 hex karakter olmalı (32 byte). Gelen: " + clean.length());
        }

        byte[] out = new byte[32];
        for (int i = 0; i < 32; i++) {
            int idx = i * 2;
            out[i] = (byte) Integer.parseInt(clean.substring(idx, idx + 2), 16);
        }
        return out;
    }
}
