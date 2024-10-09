package com.goaltracker.repository;

import com.goaltracker.model.GoalTrackerMaster;
import com.goaltracker.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GoalTrackerMasterRepository extends JpaRepository<GoalTrackerMaster,Integer> {
    List<GoalTrackerMaster> findByProjectProjectId(int projectId);
}
