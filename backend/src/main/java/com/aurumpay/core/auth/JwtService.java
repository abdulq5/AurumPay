package com.aurumpay.core.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtService {
    private final SecretKey signingKey;
    private final long accessTokenSeconds;

    public JwtService(
        @Value("${security.jwt.secret:change-me-in-development-use-a-long-random-secret}") String secret,
        @Value("${security.jwt.access-token-seconds:900}") long accessTokenSeconds
    ) {
        if (secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalArgumentException("security.jwt.secret must be at least 32 bytes");
        }
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessTokenSeconds = accessTokenSeconds;
    }

    public String createAccessToken(UUID customerId) {
        Instant now = Instant.now();
        return Jwts.builder()
            .subject(customerId.toString())
            .issuedAt(Date.from(now))
            .expiration(Date.from(now.plusSeconds(accessTokenSeconds)))
            .claim("tokenType", "access")
            .signWith(signingKey)
            .compact();
    }

    public UUID parseCustomerId(String token) {
        Claims claims = Jwts.parser().verifyWith(signingKey).build().parseSignedClaims(token).getPayload();
        if (!"access".equals(claims.get("tokenType", String.class))) {
            throw new IllegalArgumentException("Not an access token");
        }
        return UUID.fromString(claims.getSubject());
    }

    public long getAccessTokenSeconds() { return accessTokenSeconds; }
}
