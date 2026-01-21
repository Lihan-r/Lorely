package com.lorely.security;

import com.lorely.config.JwtConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void setUp() {
        JwtConfig jwtConfig = new JwtConfig();
        jwtConfig.setSecret("test-secret-key-for-jwt-signing-minimum-32-characters-long");
        jwtConfig.setAccessTokenExpiration(900000L); // 15 minutes
        jwtConfig.setRefreshTokenExpiration(604800000L); // 7 days

        jwtTokenProvider = new JwtTokenProvider(jwtConfig);
    }

    @Test
    void shouldGenerateValidAccessToken() {
        UUID userId = UUID.randomUUID();
        String email = "test@example.com";

        String token = jwtTokenProvider.generateAccessToken(userId, email);

        assertThat(token).isNotNull();
        assertThat(token).isNotEmpty();
        assertThat(jwtTokenProvider.validateToken(token)).isTrue();
    }

    @Test
    void shouldExtractUserIdFromToken() {
        UUID userId = UUID.randomUUID();
        String email = "test@example.com";

        String token = jwtTokenProvider.generateAccessToken(userId, email);

        UUID extractedUserId = jwtTokenProvider.getUserIdFromToken(token);

        assertThat(extractedUserId).isEqualTo(userId);
    }

    @Test
    void shouldExtractEmailFromToken() {
        UUID userId = UUID.randomUUID();
        String email = "test@example.com";

        String token = jwtTokenProvider.generateAccessToken(userId, email);

        String extractedEmail = jwtTokenProvider.getEmailFromToken(token);

        assertThat(extractedEmail).isEqualTo(email);
    }

    @Test
    void shouldGenerateUniqueRefreshTokens() {
        String token1 = jwtTokenProvider.generateRefreshToken();
        String token2 = jwtTokenProvider.generateRefreshToken();

        assertThat(token1).isNotEqualTo(token2);
    }

    @Test
    void shouldReturnFalseForInvalidToken() {
        assertThat(jwtTokenProvider.validateToken("invalid-token")).isFalse();
        assertThat(jwtTokenProvider.validateToken("")).isFalse();
        assertThat(jwtTokenProvider.validateToken(null)).isFalse();
    }

    @Test
    void shouldDetectExpiredToken() {
        // Create a provider with very short expiration
        JwtConfig shortConfig = new JwtConfig();
        shortConfig.setSecret("test-secret-key-for-jwt-signing-minimum-32-characters-long");
        shortConfig.setAccessTokenExpiration(1L); // 1 millisecond
        shortConfig.setRefreshTokenExpiration(1L);

        JwtTokenProvider shortProvider = new JwtTokenProvider(shortConfig);

        UUID userId = UUID.randomUUID();
        String token = shortProvider.generateAccessToken(userId, "test@example.com");

        // Wait for token to expire
        try {
            Thread.sleep(10);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        assertThat(shortProvider.isTokenExpired(token)).isTrue();
    }

    @Test
    void shouldReturnTrueForExpiredOnInvalidToken() {
        assertThat(jwtTokenProvider.isTokenExpired("invalid-token")).isTrue();
    }
}
