package com.goaltracker.service.Interface;

import com.goaltracker.dto.GoalTrackerRequestDTO;
import com.goaltracker.model.GoalTrackerMaster;
import com.goaltracker.model.TemplateAction;
import com.goaltracker.model.TemplateTypes;

import java.util.List;

public interface TrackerService {

    GoalTrackerMaster addGoalTracker(GoalTrackerRequestDTO dto);
    List<TemplateAction> getTemplateActions(TemplateTypes templateType);
}
