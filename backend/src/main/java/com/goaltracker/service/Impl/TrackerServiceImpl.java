package com.goaltracker.service.Impl;

import com.goaltracker.dto.*;
import com.goaltracker.model.*;
import com.goaltracker.repository.GoalTrackerActionRepository;
import com.goaltracker.repository.GoalTrackerMasterRepository;
import com.goaltracker.repository.ProjectRepository;
import com.goaltracker.repository.TemplateActionsRepository;
import com.goaltracker.service.Interface.FileStorageService;
import com.goaltracker.service.Interface.TrackerService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
public class TrackerServiceImpl implements TrackerService {

    private final GoalTrackerMasterRepository goalTrackerMasterRepository;
    private final ProjectRepository projectRepository;
    private final TemplateActionsRepository templateActionsRepository;
    private final GoalTrackerActionRepository goalTrackerActionRepository;
    private final FileStorageService fileStorageService;

    @Autowired
    public TrackerServiceImpl(ProjectRepository projectRepository,
                              GoalTrackerMasterRepository goalTrackerMasterRepository,
                              TemplateActionsRepository templateActionsRepository,
                              GoalTrackerActionRepository goalTrackerActionRepository,
                              FileStorageService fileStorageService) {
        this.projectRepository = projectRepository;
        this.goalTrackerMasterRepository = goalTrackerMasterRepository;
        this.templateActionsRepository = templateActionsRepository;
        this.goalTrackerActionRepository = goalTrackerActionRepository;
        this.fileStorageService = fileStorageService;
    }

    @Override
    @Transactional
    public GoalTrackerMaster addGoalTracker(GoalTrackerRequestDTO dto) {
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
            goalTracker.setStatus(Status.DRAFT);
            goalTracker.setTemplateType(TemplateTypes.valueOf(dto.getTemplate_type()));
            goalTracker.setTrackerType(dto.getType());
            goalTracker.setRating(null);
            goalTracker.setLatest(dto.getIsLatest());

            return goalTrackerMasterRepository.save(goalTracker);

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
    @Transactional
    public void updateGoalTrackerRating(int trackerId, Rating rating){
        GoalTrackerMaster goalTracker = goalTrackerMasterRepository.findById(trackerId)
                .orElseThrow(() -> new RuntimeException("Tracker with ID " + trackerId + " not found"));
        goalTracker.setRating(rating);
        goalTrackerMasterRepository.save(goalTracker);
    }

    @Override
    @Transactional
    public void addTrackerActionValues(List<ActionValueDTO> actionValueDTO, int trackerId, String note, Map<Integer, MultipartFile> actionIdToFileMap) {
        GoalTrackerMaster goalTracker = goalTrackerMasterRepository.findById(trackerId)
                .orElseThrow(() -> new RuntimeException("Tracker with ID " + trackerId + " not found"));

        int redRatingCount = 0, orangeRatingCount = 0;
        List<GoalTrackerAction> goalTrackerActionsToSave = new ArrayList<>();
        for (ActionValueDTO dto : actionValueDTO) {
            TemplateAction action = templateActionsRepository.findById(dto.getActionId())
                    .orElseThrow(() -> new RuntimeException("Action ID " + dto.getActionId() + " not found"));

            // Calculate the rating only if the action is applicable
            String rating = null;
            if(!dto.getIsNotApplicable() && !dto.getIsExcluded() && (dto.getAdditionalInfoValue() == null || dto.getAdditionalInfoValue().isEmpty())){
                rating = calculateRating(dto.getActionValue(), action,dto.getCustomBenchMarkValue());
                if (Objects.equals(rating, Rating.RED.toString())) {
                    redRatingCount++;
                }
                if (Objects.equals(rating, Rating.ORANGE.toString())) {
                    orangeRatingCount++;
                }
            }

            // Check if the action value already exists for the given tracker and action
            Optional<GoalTrackerAction> existingActionValue = goalTrackerActionRepository
                    .findByGoalTracker_TrackerIdAndTemplateAction_ActionId(trackerId, dto.getActionId());

            GoalTrackerAction goalTrackerAction;
            if (existingActionValue.isPresent()) {
                // Update the existing record
                goalTrackerAction = existingActionValue.get();
                goalTrackerAction.setActionValue(dto.getActionValue());
                goalTrackerAction.setActionRating(rating != null ? Rating.valueOf(rating) : null);
                goalTrackerAction.setIsNotApplicable(dto.getIsNotApplicable());
                goalTrackerAction.setIsExcluded(dto.getIsExcluded());
                goalTrackerAction.setActionPlan(dto.getActionPlan());
                goalTrackerAction.setActionplanETA(dto.getActionPlanETA());
                goalTrackerAction.setCustomBenchMarkValue(dto.getCustomBenchMarkValue());
                goalTrackerAction.setAdditionalInfoValue(dto.getAdditionalInfoValue());
            } else {
                // Create a new record
                goalTrackerAction = new GoalTrackerAction();
                goalTrackerAction.setGoalTracker(goalTracker);
                goalTrackerAction.setTemplateAction(action);
                goalTrackerAction.setActionValue(dto.getActionValue());
                goalTrackerAction.setActionRating(rating != null ? Rating.valueOf(rating) : null);
                goalTrackerAction.setIsNotApplicable(dto.getIsNotApplicable());
                goalTrackerAction.setIsExcluded(dto.getIsExcluded());
                goalTrackerAction.setActionPlan(dto.getActionPlan());
                goalTrackerAction.setActionplanETA(dto.getActionPlanETA());
                goalTrackerAction.setCustomBenchMarkValue(dto.getCustomBenchMarkValue());
                goalTrackerAction.setAdditionalInfoValue(dto.getAdditionalInfoValue());
            }

            // If action is not applicable or excluded and a file is attached, store the file
            if ((dto.getIsNotApplicable() != null && dto.getIsNotApplicable())
                    || (dto.getIsExcluded() != null && dto.getIsExcluded())) {
                MultipartFile file = actionIdToFileMap.get(dto.getActionId());
                if (file != null && !file.isEmpty()) {
                    try {
                        String filePath = fileStorageService.saveFile(file);
                        if (existingActionValue.isPresent()) {
                            goalTrackerAction.setAttachedDocument(filePath);
                        } else {
                            goalTrackerAction.setAttachedDocument(filePath);
                        }
                    } catch (IOException e) {
                        throw new RuntimeException("Error saving file for action ID: " + dto.getActionId(), e);
                    }
                }
            }

            goalTrackerActionsToSave.add(goalTrackerAction);
        }

        // Save or update the tracker action value
        goalTrackerActionRepository.saveAll(goalTrackerActionsToSave);

        if(note != null && !note.isEmpty()){
            goalTracker.setDm_notes(note);
        }
        // Update the overall tracker status and rating based on counts of red and orange ratings
        goalTracker.setStatus(Status.INITIATED);
        if (redRatingCount >= 2 || (redRatingCount == 1 && orangeRatingCount >= 2)) {
            goalTracker.setRating(Rating.RED);
        } else if ((redRatingCount == 1 && orangeRatingCount <= 1) || (redRatingCount == 0 && orangeRatingCount >= 1)) {
            goalTracker.setRating(Rating.YELLOW);
        } else {
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
                        goalTrackerDTO.getRating(),
                        Collections.singletonList(goalTrackerDTO)
                );

                projectDTOs.add(projectWithGoalTrackerDTO);
            }
        }

        return projectDTOs;
    }

    @Override
    public GoalTrackerDTO addNoteToTracker(int trackerId, NoteRequestDTO dto){
        GoalTrackerMaster tracker =  goalTrackerMasterRepository.findByTrackerId(trackerId)
                .orElseThrow(() -> new RuntimeException("Tracker with ID " + trackerId + " not found"));
        if(dto.getRole().equalsIgnoreCase("DM")){
            tracker.setDm_notes(dto.getNote());
        }
        else{
            tracker.setQn_notes(dto.getNote());
        }

        GoalTrackerMaster updatedTracker =  goalTrackerMasterRepository.save(tracker);
        return new GoalTrackerDTO(updatedTracker);
    }

    @Override
    public ActionValueDTO addActionPlanByTracker(int trackerId, ActionPlanRequestDTO dto){
       Optional<GoalTrackerAction> action = goalTrackerActionRepository
                .findByGoalTracker_TrackerIdAndTemplateAction_ActionId(trackerId, dto.getActionId());
       if(action.isPresent()){
           GoalTrackerAction existingAction = action.get();
           if(existingAction.getActionRating() != Rating.GREEN){
               existingAction.setActionPlan(dto.getActionPlan());
               existingAction.setActionplanETA(dto.getActionPlanETA());
               goalTrackerActionRepository.save(existingAction);
               return convertToActionValueDTO(existingAction);
           }
           else{
               throw new IllegalArgumentException("Action cannot be modified because its rating is GREEN.");
           }
       }
        throw new EntityNotFoundException("Action with tracker ID " + trackerId + " and action ID " + dto.getActionId() + " not found.");
    }

    private String calculateRating(String actionValue, TemplateAction action, String customBenchMarkValue) {
        String benchmarkValue;
        if (customBenchMarkValue != null && !customBenchMarkValue.isEmpty()) {
            benchmarkValue = customBenchMarkValue;
        } else {
            benchmarkValue = action.getBenchmarkValue();
        }

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

    private ActionValueDTO convertToActionValueDTO(GoalTrackerAction action) {
        ActionValueDTO dto = new ActionValueDTO();

        dto.setActionId(action.getTemplateAction().getActionId());
        dto.setActionPlan(action.getActionPlan());
        dto.setActionPlanETA(action.getActionplanETA());
        return dto;
    }
}
