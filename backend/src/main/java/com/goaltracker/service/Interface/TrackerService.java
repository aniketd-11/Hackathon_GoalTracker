package com.goaltracker.service.Interface;

import com.goaltracker.dto.ActionValueDTO;
import com.goaltracker.dto.GoalTrackerDTO;
import com.goaltracker.dto.GoalTrackerRequestDTO;
import com.goaltracker.dto.ProjectWithGoalTrackerDTO;
import com.goaltracker.model.GoalTrackerMaster;
import com.goaltracker.model.Status;
import com.goaltracker.model.TemplateAction;
import com.goaltracker.model.TemplateTypes;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface TrackerService {

    GoalTrackerMaster addGoalTracker(GoalTrackerRequestDTO dto);
    List<TemplateAction> getTemplateActions(TemplateTypes templateType);
    void addTrackerActionValues(List<ActionValueDTO> actionValueDTO, int trackerId, Map<Integer,MultipartFile> files);
    GoalTrackerDTO getGoalTrackerWithActions(int trackerId);
    void updateGoalTrackerStatus(int trackerId, Status status);
    List<ProjectWithGoalTrackerDTO> getAllProjectsWithGoalTrackers(TemplateTypes templateType);
}
