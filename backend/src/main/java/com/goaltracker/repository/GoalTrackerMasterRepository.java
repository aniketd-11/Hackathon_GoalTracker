package com.goaltracker.repository;

import com.goaltracker.model.GoalTrackerMaster;
import com.goaltracker.model.Project;
import com.goaltracker.model.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface GoalTrackerMasterRepository extends JpaRepository<GoalTrackerMaster,Integer> {
    List<GoalTrackerMaster> findByProjectProjectId(int projectId);
    GoalTrackerMaster findByProject_ProjectIdAndIsLatest(int projectId, boolean isLatest);
    @Query("SELECT g FROM GoalTrackerMaster g WHERE g.trackerId = :trackerId")
    Optional<GoalTrackerMaster> findByTrackerId(@Param("trackerId") int trackerId);

    @Query("SELECT g FROM GoalTrackerMaster g WHERE g.project.projectId = :projectId AND g.status <> :draftStatus")
    List<GoalTrackerMaster> findByProjectProjectIdAndExcludeDraft(@Param("projectId") int projectId, @Param("draftStatus") Status draftStatus);

}
