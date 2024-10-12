package com.goaltracker.service.Impl;

import com.goaltracker.dto.*;
import com.goaltracker.model.*;
import com.goaltracker.repository.GoalTrackerActionRepository;
import com.goaltracker.repository.GoalTrackerMasterRepository;
import com.goaltracker.repository.ProjectRepository;
import com.goaltracker.repository.TemplateActionsRepository;
import com.goaltracker.service.Interface.TrackerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TrackerServiceImpl implements TrackerService {

    private final GoalTrackerMasterRepository goalTrackerMasterRepository;
    private final ProjectRepository projectRepository;
    private final TemplateActionsRepository templateActionsRepository;

    private final GoalTrackerActionRepository goalTrackerActionRepository;

    @Autowired
    public TrackerServiceImpl(ProjectRepository projectRepository,
                              GoalTrackerMasterRepository goalTrackerMasterRepository,
                              TemplateActionsRepository templateActionsRepository,
                              GoalTrackerActionRepository goalTrackerActionRepository) {
        this.projectRepository = projectRepository;
        this.goalTrackerMasterRepository = goalTrackerMasterRepository;
        this.templateActionsRepository = templateActionsRepository;
        this.goalTrackerActionRepository = goalTrackerActionRepository;
    }

    @Override
    public GoalTrackerMaster addGoalTracker(GoalTrackerRequestDTO dto) {
        try {
            // Fetch project entity based on projectId from DTO using Java 8 Optional
            Project project = projectRepository.findById(dto.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project with ID " + dto.getProjectId() + " not found"));

            if (dto.getIsLatest()) {
                GoalTrackerMaster existingTrackers = goalTrackerMasterRepository.findByProject_ProjectIdAndIsLatest(dto.getProjectId(), true);
                if(existingTrackers != null){
                    existingTrackers.setLatest(false);
                    goalTrackerMasterRepository.save(existingTrackers);
                }
            }

            GoalTrackerMaster goalTracker = new GoalTrackerMaster();
            goalTracker.setGoalTrackerName(dto.getGoalTrackerName());
            goalTracker.setStartDate(dto.getStartDate());
            goalTracker.setEndDate(dto.getEndDate());
            goalTracker.setProject(project);
            goalTracker.setStatus(Status.INITIATED);
            goalTracker.setRating(null);
            goalTracker.setLatest(dto.getIsLatest());

            GoalTrackerMaster savedGoalTracker = goalTrackerMasterRepository.save(goalTracker);
            return savedGoalTracker;

        } catch (Exception e) {
            throw new RuntimeException("Failed to add GoalTracker");
        }
    }

    @Override
    public List<TemplateAction> getTemplateActions(TemplateTypes templateType) {
        return templateActionsRepository.findByTemplateTypes(templateType);
    }

    @Override
    public GoalTrackerDTO getGoalTrackerWithActions(int trackerId) {
        // Fetch GoalTrackerMaster by trackerId
        GoalTrackerMaster goalTracker = goalTrackerMasterRepository.findById(trackerId)
                .orElseThrow(() -> new RuntimeException("Goal Tracker not found"));

        // Fetch associated GoalTrackerAction and TemplateAction details
        List<GoalTrackerActionDTO> actions = fetchActionsForTracker(trackerId);

        // Create and return DTO containing both tracker details and actions
        return new GoalTrackerDTO(goalTracker, actions);
    }

    @Override
    public void updateGoalTrackerStatus(int trackerId, Status status){
        GoalTrackerMaster goalTracker = goalTrackerMasterRepository.findById(trackerId)
                .orElseThrow(() -> new RuntimeException("Tracker with ID " + trackerId + " not found"));
        goalTracker.setStatus(status);
        goalTrackerMasterRepository.save(goalTracker);
    }

    @Override
    public void addTrackerActionValues(List<ActionValueDTO> actionValueDTO, int trackerId) {
        GoalTrackerMaster goalTracker = goalTrackerMasterRepository.findById(trackerId)
                .orElseThrow(() -> new RuntimeException("Tracker with ID " + trackerId + " not found"));

        int redRatingCount = 0, orangeRatingCount = 0;

        for (ActionValueDTO dto : actionValueDTO) {
            TemplateAction action = templateActionsRepository.findById(dto.getActionId())
                    .orElseThrow(() -> new RuntimeException("Action ID " + dto.getActionId() + " not found"));

            // Calculate the rating based on the action's value, benchmark, and comparison operator
            String rating = calculateRating(dto.getActionValue(), action);
            if(Objects.equals(rating, Rating.RED.toString())){
                redRatingCount++;
            }
            if(Objects.equals(rating, Rating.ORANGE.toString())){
                orangeRatingCount++;
            }

            // Check if the action value already exists for the given tracker and action
            Optional<GoalTrackerAction> existingActionValue = goalTrackerActionRepository.findByGoalTracker_TrackerIdAndTemplateAction_ActionId(trackerId, dto.getActionId());

            GoalTrackerAction goalTrackerAction;
            if (existingActionValue.isPresent()) {
                // Update the existing record
                goalTrackerAction = existingActionValue.get();
                goalTrackerAction.setActionValue(dto.getActionValue());
                goalTrackerAction.setActionRating(Rating.valueOf(rating));
            } else {
                // Create a new record
                goalTrackerAction = new GoalTrackerAction();
                goalTrackerAction.setGoalTracker(goalTracker);
                goalTrackerAction.setTemplateAction(action);
                goalTrackerAction.setActionValue(dto.getActionValue());
                goalTrackerAction.setActionRating(Rating.valueOf(rating));
            }

            // Save or update the tracker action value
            goalTrackerActionRepository.save(goalTrackerAction);
        }
        goalTracker.setStatus(Status.IN_PROGRESS);
        if(redRatingCount >= 2 || (redRatingCount == 1 && orangeRatingCount >= 2)){
            goalTracker.setRating(Rating.RED);
        }
        if((redRatingCount == 1 && orangeRatingCount <= 1) || (redRatingCount == 0 && orangeRatingCount >= 1)){
            goalTracker.setRating(Rating.YELLOW);
        }
        else {
            goalTracker.setRating(Rating.GREEN);
        }
        goalTrackerMasterRepository.save(goalTracker);
    }

    @Override
    // Method to retrieve all projects with their latest goal trackers
    public List<ProjectWithGoalTrackerDTO> getAllProjectsWithGoalTrackers(TemplateTypes templateType) {
        // Fetch all projects
        List<Project> projects = projectRepository.findByTemplateType(templateType); // Filter by templateType if required

        List<ProjectWithGoalTrackerDTO> projectDTOs = new ArrayList<>();

        for (Project project : projects) {
            // Fetch the latest tracker for the current project (where isLatest = 1)
            GoalTrackerMaster latestTracker = goalTrackerMasterRepository
                    .findByProject_ProjectIdAndIsLatest(project.getProjectId(),true);

            if (latestTracker != null) {
                // Fetch associated actions for the latest tracker
                List<GoalTrackerActionDTO> actions = fetchActionsForTracker(latestTracker.getTrackerId());

                // Create GoalTrackerDTO with tracker and its actions
                GoalTrackerDTO goalTrackerDTO = new GoalTrackerDTO(latestTracker, actions);

                // Create the ProjectWithGoalTrackerDTO
                ProjectWithGoalTrackerDTO projectWithGoalTrackerDTO = new ProjectWithGoalTrackerDTO(
                        project.getProjectId(),
                        project.getProjectName(),
                        project.getTemplateType() != null ? project.getTemplateType().toString() : null,
                        Collections.singletonList(goalTrackerDTO)
                );

                projectDTOs.add(projectWithGoalTrackerDTO);
            }
        }

        return projectDTOs;
    }

    private String calculateRating(String actionValue, TemplateAction action) {
        String benchmarkValue = action.getBenchmarkValue();
        TemplateAction.ComparisonOperator operator = action.getComparisonOperator();
        TemplateAction.ActionType actionType = action.getActionType();
        TemplateAction.ActionCategory actionCategory = action.getActionCategory();  // Fetching the action category

        // Handle numeric and percentage types in the same case as both are numeric comparisons
        if (actionType == TemplateAction.ActionType.NUMERIC || actionType == TemplateAction.ActionType.PERCENTAGE) {
            int numericValue = Integer.parseInt(actionValue);
            int benchmarkNumeric =Integer.parseInt(benchmarkValue);
            return evaluateNumericAndPercentageRating(numericValue, benchmarkNumeric, operator, actionCategory);
        }

        // Handle boolean type
        if (actionType == TemplateAction.ActionType.OPTION) {
            return evaluateOptionRating(actionValue, benchmarkValue, actionCategory);
        }

        // Handle string type
//        if (actionType == TemplateAction.ActionType.STRING) {
//            return evaluateStringRating(actionValue, benchmarkValue, operator, actionCategory);
//        }

        return "UNKNOWN";
    }

    private String evaluateNumericAndPercentageRating(int value, int benchmark, TemplateAction.ComparisonOperator operator, TemplateAction.ActionCategory actionCategory) {
        boolean isValid;
        switch (operator) {
            case GREATER_THAN_EQUAL:
                isValid = value >= benchmark;
                break;
            case LESS_THAN_EQUAL:
                isValid = value <= benchmark;
                break;
            case EQUAL:
                isValid = value == benchmark;
                break;
            case NOT_EQUAL:
                isValid = value != benchmark;
                break;
            default:
                return "UNKNOWN";
        }

        // Apply category-specific logic (MAJOR, MINOR)
        if (isValid) {
            return "GREEN";
        } else {
            if (actionCategory == TemplateAction.ActionCategory.MAJOR) {
                return "RED";
            } else if (actionCategory == TemplateAction.ActionCategory.MINOR) {
                return "ORANGE";
            } else {
                return "YELLOW";
            }
        }
    }

    private String evaluateOptionRating(String value, String benchmark, TemplateAction.ActionCategory actionCategory) {
        boolean isValid;
        isValid = value.equals(benchmark);

        // Apply category-specific logic (MAJOR, MINOR)
        if (isValid) {
            return "GREEN";
        } else {
            if (actionCategory == TemplateAction.ActionCategory.MAJOR) {
                return "RED";  // For major actions, failed benchmark results in RED
            } else if (actionCategory == TemplateAction.ActionCategory.MINOR) {
                return "ORANGE";  // For minor actions, failed benchmark results in ORANGE
            } else {
                return "YELLOW";  // Default case for other categories
            }
        }
    }

    private List<GoalTrackerActionDTO> fetchActionsForTracker(int trackerId) {
        return goalTrackerActionRepository.findActionsByTrackerId(trackerId);
    }
}
