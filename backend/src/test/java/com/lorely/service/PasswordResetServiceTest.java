package com.lorely.service;

import com.lorely.dto.request.ForgotPasswordRequest;
import com.lorely.model.User;
import com.lorely.repository.PasswordResetTokenRepository;
import com.lorely.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PasswordResetServiceTest {

    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private PasswordResetService passwordResetService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(UUID.randomUUID())
                .email("user@example.com")
                .passwordHash("hashed-password")
                .build();
    }

    @Test
    void forgotPassword_shouldSendEmailWhenUserExists() {
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(testUser));
        when(passwordResetTokenRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        ForgotPasswordRequest request = new ForgotPasswordRequest("user@example.com");
        passwordResetService.forgotPassword(request);

        verify(emailService).sendPasswordResetEmail(eq("user@example.com"), any(String.class));
        verify(passwordResetTokenRepository).save(any());
    }

    @Test
    void forgotPassword_shouldNotSendEmailWhenUserDoesNotExist() {
        when(userRepository.findByEmail("unknown@example.com")).thenReturn(Optional.empty());

        ForgotPasswordRequest request = new ForgotPasswordRequest("unknown@example.com");
        passwordResetService.forgotPassword(request);

        verify(emailService, never()).sendPasswordResetEmail(any(), any());
        verify(passwordResetTokenRepository, never()).save(any());
    }
}
