package com.goaltracker.controller;

import com.goaltracker.dto.GoalTrackerRequestDTO;
import com.goaltracker.model.GoalTrackerMaster;
import com.goaltracker.service.Interface.AccountService;
import com.goaltracker.service.Interface.ProjectService;
import com.goaltracker.service.Interface.TrackerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tracker")
public class TrackerController {

    private final TrackerService trackerService;

    // Constructor injection
    public TrackerController(TrackerService trackerService) {
        this.trackerService = trackerService;
    }

    @PostMapping("/create-tracker")
    public ResponseEntity<?> createGoalTracker(@RequestBody GoalTrackerRequestDTO dto) {
        try {
            GoalTrackerMaster goalTracker = trackerService.addGoalTracker(dto);
            return ResponseEntity.ok(goalTracker.getTrackerId());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error occurred while creating Goal Tracker: " + e.getMessage());
        }
    }
}
