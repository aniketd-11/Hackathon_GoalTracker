package com.goaltracker.controller;

import com.goaltracker.dto.ActionValueDTO;
import com.goaltracker.dto.GoalTrackerDTO;
import com.goaltracker.dto.GoalTrackerRequestDTO;
import com.goaltracker.model.GoalTrackerMaster;
import com.goaltracker.model.Status;
import com.goaltracker.model.TemplateAction;
import com.goaltracker.model.TemplateTypes;
import com.goaltracker.service.Interface.AccountService;
import com.goaltracker.service.Interface.ProjectService;
import com.goaltracker.service.Interface.TrackerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/get-trackerActions")
    public ResponseEntity<?> getTrackerActions(@RequestParam TemplateTypes templateType){
        try {
            List<TemplateAction> templateActions = trackerService.getTemplateActions(templateType);
            return ResponseEntity.ok(templateActions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error occurred getting Goal Tracker Actions: " + e.getMessage());
        }
    }

    @PostMapping("/add-trackerActionValue")
    public ResponseEntity<?> addTrackerActionValues(@RequestBody List<ActionValueDTO> actionValueDTOs, @RequestParam int trackerId) {
        try {
            trackerService.addTrackerActionValues(actionValueDTOs, trackerId);
            return ResponseEntity.ok("Action values and ratings saved successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error occurred while processing action values: " + e.getMessage());
        }
    }

    @GetMapping("/getGoalTrackerWithActionsById")
    public ResponseEntity<?> getGoalTrackerWithActionsById(@RequestParam int trackerId) {
        try {
            // Call service method to get tracker details
            GoalTrackerDTO goalTrackerDTO = trackerService.getGoalTrackerWithActions(trackerId);
            return ResponseEntity.ok(goalTrackerDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving goal tracker: " + e.getMessage());
        }
    }

    @PutMapping("/{trackerId}/status")
    public ResponseEntity<?> updateGoalTrackerStatus(@PathVariable int trackerId, @RequestBody Status status) {
        try {
            trackerService.updateGoalTrackerStatus(trackerId, status);
            return ResponseEntity.ok("Status updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating status: " + e.getMessage());
        }
    }
}
