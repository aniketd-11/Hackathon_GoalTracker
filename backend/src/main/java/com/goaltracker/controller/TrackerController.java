package com.goaltracker.controller;

import com.goaltracker.dto.ActionValueDTO;
import com.goaltracker.dto.GoalTrackerDTO;
import com.goaltracker.dto.GoalTrackerRequestDTO;
import com.goaltracker.dto.ProjectWithGoalTrackerDTO;
import com.goaltracker.model.GoalTrackerMaster;
import com.goaltracker.model.Status;
import com.goaltracker.model.TemplateAction;
import com.goaltracker.model.TemplateTypes;
import com.goaltracker.service.Interface.AccountService;
import com.goaltracker.service.Interface.ExcelService;
import com.goaltracker.service.Interface.ProjectService;
import com.goaltracker.service.Interface.TrackerService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;

@RestController
@RequestMapping("/tracker")
public class TrackerController {

    private final TrackerService trackerService;
    private final ExcelService excelService;

    // Constructor injection
    public TrackerController(TrackerService trackerService,ExcelService excelService) {
        this.trackerService = trackerService;
        this.excelService = excelService;
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

    @GetMapping("/download")
    public ResponseEntity<?> downloadGoalTrackerExcel(@RequestParam TemplateTypes templateType) {
        try {
            List<ProjectWithGoalTrackerDTO> dto = trackerService.getAllProjectsWithGoalTrackers(templateType);
            List<TemplateAction> templateActions = trackerService.getTemplateActions(templateType);
            ByteArrayInputStream in = excelService.generateExcel(dto,templateActions);

            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=goal_tracker_report.xlsx");

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(in.readAllBytes());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
