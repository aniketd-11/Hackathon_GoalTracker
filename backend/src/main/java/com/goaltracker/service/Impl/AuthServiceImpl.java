package com.goaltracker.service.Impl;

import com.goaltracker.dto.UserDTO;
import com.goaltracker.model.User;
import com.goaltracker.repository.UserRepository;
import com.goaltracker.service.Interface.AuthService;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    public AuthServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    @Override
    public UserDTO login(String email, String password){
        User user = userRepository.findByEmail(email);
        if(user != null){
            return new UserDTO(user.getName(), user.getEmail(), user.getRole().getRole_name(), user.getRole().getRole_id());
        }
        return null;
    }
}
