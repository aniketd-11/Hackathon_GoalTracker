package com.goaltracker.service.Impl;

import com.goaltracker.dto.AccountDTO;
import com.goaltracker.dto.ProjectDTO;
import com.goaltracker.model.User;
import com.goaltracker.repository.ProjectRepository;
import com.goaltracker.repository.UserProjectMappingRepository;
import com.goaltracker.repository.UserRepository;
import com.goaltracker.service.Interface.ProjectService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectServiceImpl implements ProjectService {

    private final UserRepository userRepository;

    private final UserProjectMappingRepository userProjectMappingRepository;

    private final ProjectRepository projectRepository;
    public ProjectServiceImpl(UserRepository userRepository, UserProjectMappingRepository userProjectMappingRepository,
                              ProjectRepository projectRepository){
        this.userRepository = userRepository;
        this.userProjectMappingRepository = userProjectMappingRepository;
        this.projectRepository = projectRepository;
    }

    @Override
    public List<ProjectDTO> getProjectsForDM(String email) {
        // Fetch the DM (user) by email
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("DM not found");
        }

        // Fetch the projects assigned to the DM
        return userProjectMappingRepository.findByUserId(user.getId())
                .stream()
                .map(mapping -> new ProjectDTO(mapping.getProject()))
                .collect(Collectors.toList());
    }

    @Override
    public List<ProjectDTO> getAllProjectsForQNTeam(int accountId) {
        return projectRepository.findAll()
                .stream()
                .map(ProjectDTO::new)
                .collect(Collectors.toList());
    }
}
