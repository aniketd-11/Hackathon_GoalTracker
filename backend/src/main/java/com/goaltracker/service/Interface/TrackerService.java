package com.goaltracker.service.Interface;

import com.goaltracker.dto.GoalTrackerRequestDTO;
import com.goaltracker.model.GoalTrackerMaster;

public interface TrackerService {

    GoalTrackerMaster addGoalTracker(GoalTrackerRequestDTO dto);
}
