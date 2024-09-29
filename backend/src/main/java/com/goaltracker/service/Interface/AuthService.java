package com.goaltracker.service.Interface;

import com.goaltracker.dto.UserDTO;

public interface AuthService {
    UserDTO login(String email, String password);
}
