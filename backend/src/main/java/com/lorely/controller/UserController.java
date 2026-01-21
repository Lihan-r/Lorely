package com.lorely.controller;

import com.lorely.dto.response.UserResponse;
import com.lorely.model.User;
import com.lorely.security.UserPrincipal;
import com.lorely.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = authService.getUserById(userPrincipal.getUserId());
        return ResponseEntity.ok(UserResponse.fromUser(user));
    }
}
