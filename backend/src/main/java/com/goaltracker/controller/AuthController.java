package com.goaltracker.controller;

import com.goaltracker.dto.LoginRequestDTO;
import com.goaltracker.dto.UserDTO;
import com.goaltracker.service.Interface.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    // Constructor injection
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequestDTO) {
        try {
            String email = loginRequestDTO.getEmail();
            String password = loginRequestDTO.getPassword();
            UserDTO userDTO = authService.login(email, password);
            if (userDTO != null) {
                return ResponseEntity.ok(userDTO);
            }
            else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
            }
        }
        catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred during login");
        }
    }
}
