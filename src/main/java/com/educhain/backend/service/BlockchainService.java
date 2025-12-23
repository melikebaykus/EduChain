package com.educhain.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.FunctionReturnDecoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Bool;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.generated.Bytes32;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.Transaction;
import org.web3j.protocol.http.HttpService;

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

    // ✅ RPC bağlantı testi (senin BLOCKCHAIN_OK aldığın yer)
    public boolean pingBlockchain() {
        try {
            web3j.web3ClientVersion().send();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // ✅ Smart Contract OKUMA: verifyCertificate(bytes32) -> bool
    public boolean verifyCertificateOnChain(byte[] certificateHash32) throws Exception {

        Function function = new Function(
                "verifyCertificate",
                Collections.singletonList(new Bytes32(certificateHash32)),
                Collections.singletonList(new TypeReference<Bool>() {})
        );

        String encoded = FunctionEncoder.encode(function);

        Transaction tx = Transaction.createEthCallTransaction(
                null,
                contractAddress,
                encoded
        );

        String value = web3j.ethCall(tx, DefaultBlockParameterName.LATEST)
                .send()
                .getValue();

        List<org.web3j.abi.datatypes.Type> decoded =
                FunctionReturnDecoder.decode(value, function.getOutputParameters());

        if (decoded == null || decoded.isEmpty()) return false;

        Bool isValid = (Bool) decoded.get(0);
        return Boolean.TRUE.equals(isValid.getValue());
    }

    // ✅ Hex hash (64 char) -> bytes32
    public static byte[] hexToBytes32(String hex) {
        if (hex == null) throw new IllegalArgumentException("hash null olamaz");

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

    public Web3j getWeb3j() {
        return web3j;
    }

    public String getContractAddress() {
        return contractAddress;
    }

    public Credentials getCredentials() {
        return credentials;
    }
}
