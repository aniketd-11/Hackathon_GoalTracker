package com.goaltracker.repository;

import com.goaltracker.dto.GoalTrackerActionDTO;
import com.goaltracker.model.GoalTrackerAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface GoalTrackerActionRepository extends JpaRepository<GoalTrackerAction,Integer> {
    Optional<GoalTrackerAction> findByGoalTracker_TrackerIdAndTemplateAction_ActionId(int trackerId, int actionId);

    @Query("SELECT new com.goaltracker.dto.GoalTrackerActionDTO(ga.actionValue, ga.actionRating, ta) " +
            "FROM GoalTrackerAction ga " +
            "JOIN ga.templateAction ta " +
            "JOIN ga.goalTracker gm " +
            "WHERE gm.trackerId = :trackerId")
    List<GoalTrackerActionDTO> findActionsByTrackerId(int trackerId);
}
