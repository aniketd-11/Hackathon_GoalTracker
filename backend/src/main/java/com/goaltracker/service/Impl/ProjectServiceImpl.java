package com.goaltracker.service.Impl;

import com.goaltracker.dto.ProjectWithGoalTrackerDTO;
import com.goaltracker.model.GoalTrackerMaster;
import com.goaltracker.model.Project;
import com.goaltracker.model.User;
import com.goaltracker.repository.GoalTrackerMasterRepository;
import com.goaltracker.repository.ProjectRepository;
import com.goaltracker.repository.UserProjectMappingRepository;
import com.goaltracker.repository.UserRepository;
import com.goaltracker.service.Interface.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProjectServiceImpl implements ProjectService {

    private final UserRepository userRepository;
    private final UserProjectMappingRepository userProjectMappingRepository;
    private final GoalTrackerMasterRepository goalTrackerMasterRepository;
    private final ProjectRepository projectRepository;

    @Autowired
    public ProjectServiceImpl(UserRepository userRepository, UserProjectMappingRepository userProjectMappingRepository,
                              ProjectRepository projectRepository, GoalTrackerMasterRepository goalTrackerMasterRepository) {
        this.userRepository = userRepository;
        this.userProjectMappingRepository = userProjectMappingRepository;
        this.projectRepository = projectRepository;
        this.goalTrackerMasterRepository = goalTrackerMasterRepository;
    }

    @Override
    public List<ProjectWithGoalTrackerDTO> getProjectsForDM(String email) {
        // Fetch the DM (user) by email using Optional for null safety
        User user = Optional.ofNullable(userRepository.findByEmail(email))
                .orElseThrow(() -> new RuntimeException("DM not found"));

        // Fetch the projects assigned to the DM
        return userProjectMappingRepository.findByUserId(user.getId())
                .stream()
                .map(mapping -> mapToProjectWithGoalTrackerDTO(mapping.getProject()))
                .collect(Collectors.toList());
    }

    @Override
    public List<ProjectWithGoalTrackerDTO> getAllProjectsForQNTeam(int accountId) {
        // Fetch all projects and map to DTO
        return projectRepository.findAll()
                .stream()
                .map(this::mapToProjectWithGoalTrackerDTO)
                .collect(Collectors.toList());
    }

    // Helper method to avoid code repetition for mapping project and goal tracker details
    private ProjectWithGoalTrackerDTO mapToProjectWithGoalTrackerDTO(Project project) {
        // Fetch the most recent goal tracker for the project
        GoalTrackerMaster tracker = goalTrackerMasterRepository.findTopByProjectProjectIdOrderByStartDateDesc(project.getProjectId());

        // Map project and goal tracker details into DTO
        return new ProjectWithGoalTrackerDTO(
                project.getProjectId(),
                project.getProjectName(),
                project.getTemplateType().name(),
                tracker != null ? tracker.getTrackerId() : 0,
                tracker != null ? tracker.getGoalTrackerName() : null,
                tracker != null ? tracker.getStartDate() : null,
                tracker != null ? tracker.getEndDate() : null,
                tracker != null && tracker.getStatus() != null ? tracker.getStatus().name() : null,
                tracker != null && tracker.getRating() != null ? tracker.getRating().name() : null
        );
    }
}
