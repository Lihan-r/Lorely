package com.lorely.service;

import com.lorely.dto.request.ChangePasswordRequest;
import com.lorely.dto.request.UpdateProfileRequest;
import com.lorely.dto.response.UserResponse;
import com.lorely.exception.ResourceNotFoundException;
import com.lorely.exception.ValidationException;
import com.lorely.model.User;
import com.lorely.repository.ProjectRepository;
import com.lorely.repository.RefreshTokenRepository;
import com.lorely.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public User getUserById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Transactional
    public UserResponse updateProfile(UUID userId, UpdateProfileRequest request) {
        log.debug("Updating profile for user {}", userId);

        User user = getUserById(userId);
        user.setDisplayName(request.getDisplayName());
        User savedUser = userRepository.save(user);

        log.info("Profile updated for user {}", userId);
        return UserResponse.fromUser(savedUser);
    }

    @Transactional
    public void changePassword(UUID userId, ChangePasswordRequest request) {
        log.debug("Changing password for user {}", userId);

        User user = getUserById(userId);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new ValidationException("Current password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        log.info("Password changed for user {}", userId);
    }

    @Transactional
    public void deleteAccount(UUID userId) {
        log.debug("Deleting account for user {}", userId);

        User user = getUserById(userId);

        // Delete refresh tokens
        refreshTokenRepository.deleteByUserId(userId);

        // Delete user (projects cascade via DB constraints)
        userRepository.delete(user);

        log.info("Account deleted for user {}", userId);
    }
}
