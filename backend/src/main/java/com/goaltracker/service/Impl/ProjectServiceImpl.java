package com.goaltracker.service.Impl;

import com.goaltracker.dto.GoalTrackerDTO;
import com.goaltracker.dto.ProjectWithGoalTrackerDTO;
import com.goaltracker.model.GoalTrackerMaster;
import com.goaltracker.model.Project;
import com.goaltracker.model.Status;
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
                .map(mapping -> mapToProjectWithGoalTrackersDTO(mapping.getProject(), Optional.of("DM")))
                .collect(Collectors.toList());
    }

    @Override
    public List<ProjectWithGoalTrackerDTO> getAllProjectsForQNTeam(int accountId) {
        List<Project> projects = projectRepository.findByAccount_AccountId(accountId);

        // Map projects and their goal trackers to DTOs
        return projects.stream()
                .map(project -> mapToProjectWithGoalTrackersDTO(project, Optional.empty()))
                .collect(Collectors.toList());
    }

    // Helper method to map Project and its goal trackers to a DTO
    private ProjectWithGoalTrackerDTO mapToProjectWithGoalTrackersDTO(Project project,Optional<String> role) {
        // Fetch all goal trackers for the project
        List<GoalTrackerMaster> trackers;
        if(role.isPresent()){
            trackers = goalTrackerMasterRepository.findByProjectProjectId(project.getProjectId());
        }
        else {
            trackers = goalTrackerMasterRepository.findByProjectProjectIdAndExcludeDraft(project.getProjectId(), Status.DRAFT);
        }


        final String[] projectRating = {null};

        // Map goal trackers to GoalTrackerDTO
        List<GoalTrackerDTO> goalTrackers = trackers.stream()
                .map(tracker -> {
                    if (tracker.isLatest() && tracker.getRating() != null) {
                        projectRating[0] = tracker.getRating().toString();
                    }
                    return new GoalTrackerDTO(
                        tracker.getTrackerId(),
                        tracker.getGoalTrackerName(),
                        tracker.getStartDate(),
                        tracker.getEndDate(),
                        tracker.getStatus() != null ? tracker.getStatus().toString() : null,
                        tracker.getRating() != null ? tracker.getRating().toString() : null,
                        tracker.isLatest(),
                        tracker.getTemplateType() != null ? tracker.getTemplateType().toString() : null, // Add templateType
                        tracker.getTrackerType(),
                        tracker.getQn_notes(),
                        tracker.getDm_notes(),
                        null
                    );
                })
                .collect(Collectors.toList());

        // Return the ProjectWithGoalTrackersDTO with the project and its goal trackers
        return new ProjectWithGoalTrackerDTO(
                project.getProjectId(),
                project.getProjectName(),
                project.getTemplateType().name(),
                projectRating[0],
                goalTrackers
        );
    }

}
