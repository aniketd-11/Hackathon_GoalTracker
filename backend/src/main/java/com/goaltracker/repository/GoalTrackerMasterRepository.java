package com.goaltracker.repository;

import com.goaltracker.model.GoalTrackerMaster;
import com.goaltracker.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GoalTrackerMasterRepository extends JpaRepository<GoalTrackerMaster,Integer> {
    GoalTrackerMaster findTopByProjectProjectIdOrderByStartDateDesc(int projectId);
}
