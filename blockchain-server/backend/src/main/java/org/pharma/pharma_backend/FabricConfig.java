package org.pharma.pharma_backend;

import io.grpc.Grpc;
import io.grpc.ManagedChannel;
import io.grpc.TlsChannelCredentials;
import org.hyperledger.fabric.client.Gateway;
import org.hyperledger.fabric.client.Network;
import org.hyperledger.fabric.client.identity.Identities;
import org.hyperledger.fabric.client.identity.Signers;
import org.hyperledger.fabric.client.identity.X509Identity;

import java.nio.file.Files;
import java.nio.file.Path;
import java.security.PrivateKey;
import java.security.cert.X509Certificate;
import java.util.concurrent.TimeUnit;

public final class FabricConfig {

    private static Gateway gateway;
    private static ManagedChannel channel;

    private FabricConfig() { }

    private static String getEnv(String key, String defaultValue) {
        String val = System.getenv(key);
        return (val != null && !val.isBlank()) ? val : defaultValue;
    }

    public static synchronized Network getNetwork() throws Exception {
        if (gateway == null) {
            String channelName = getEnv("CHANNEL_NAME", "mychannel");
            String mspId = getEnv("MSP_ID", "Org1MSP");
            String peerEndpoint = getEnv("PEER_ENDPOINT", "localhost:7051");
            String overrideAuth = getEnv("PEER_OVERRIDE_AUTH", "peer0.org1.example.com");

            Path certPath = Path.of(getEnv("FABRIC_CERT_PATH",
                "/crypto/users/User1@org1.example.com/msp/signcerts/cert.pem"));
            Path keyDir = Path.of(getEnv("FABRIC_KEY_DIR",
                "/crypto/users/User1@org1.example.com/msp/keystore"));
            Path tlsCertPath = Path.of(getEnv("FABRIC_TLS_CERT_PATH",
                "/crypto/peers/peer0.org1.example.com/tls/ca.crt"));

            var credentials = TlsChannelCredentials.newBuilder()
                    .trustManager(tlsCertPath.toFile())
                    .build();

            channel = Grpc.newChannelBuilder(peerEndpoint, credentials)
                    .overrideAuthority(overrideAuth)
                    .build();

            X509Certificate cert = Identities.readX509Certificate(Files.newBufferedReader(certPath));
            Path keyFile = Files.list(keyDir).findFirst().orElseThrow(
                () -> new IllegalStateException("No private key file found in keystore directory: " + keyDir));
            PrivateKey privateKey = Identities.readPrivateKey(Files.newBufferedReader(keyFile));

            gateway = Gateway.newInstance()
                    .identity(new X509Identity(mspId, cert))
                    .signer(Signers.newPrivateKeySigner(privateKey))
                    .connection(channel)
                    .evaluateOptions(options -> options.withDeadlineAfter(30, TimeUnit.SECONDS))
                    .endorseOptions(options -> options.withDeadlineAfter(60, TimeUnit.SECONDS))
                    .submitOptions(options -> options.withDeadlineAfter(60, TimeUnit.SECONDS))
                    .commitStatusOptions(options -> options.withDeadlineAfter(60, TimeUnit.SECONDS))
                    .connect();
        }
        return gateway.getNetwork(getEnv("CHANNEL_NAME", "mychannel"));
    }
}

