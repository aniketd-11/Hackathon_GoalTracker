package com.goaltracker.service.Impl;

import com.goaltracker.dto.GoalTrackerRequestDTO;
import com.goaltracker.model.GoalTrackerMaster;
import com.goaltracker.model.Project;
import com.goaltracker.model.TemplateAction;
import com.goaltracker.model.TemplateTypes;
import com.goaltracker.repository.GoalTrackerMasterRepository;
import com.goaltracker.repository.ProjectRepository;
import com.goaltracker.repository.TemplateActionsRepository;
import com.goaltracker.service.Interface.TrackerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrackerServiceImpl implements TrackerService {

    private final GoalTrackerMasterRepository goalTrackerMasterRepository;
    private final ProjectRepository projectRepository;
    private final TemplateActionsRepository templateActionsRepository;

    @Autowired
    public TrackerServiceImpl(ProjectRepository projectRepository,
                              GoalTrackerMasterRepository goalTrackerMasterRepository,
                              TemplateActionsRepository templateActionsRepository) {
        this.projectRepository = projectRepository;
        this.goalTrackerMasterRepository = goalTrackerMasterRepository;
        this.templateActionsRepository = templateActionsRepository;
    }

    @Override
    public GoalTrackerMaster addGoalTracker(GoalTrackerRequestDTO dto) {
        try {
            // Fetch project entity based on projectId from DTO using Java 8 Optional
            Project project = projectRepository.findById(dto.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project with ID " + dto.getProjectId() + " not found"));

            GoalTrackerMaster goalTracker = new GoalTrackerMaster();
            goalTracker.setGoalTrackerName(dto.getGoalTrackerName());
            goalTracker.setStartDate(dto.getStartDate());
            goalTracker.setEndDate(dto.getEndDate());
            goalTracker.setProject(project);
            goalTracker.setStatus(null);
            goalTracker.setRating(null);
            goalTracker.setLatest(false);

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

}
