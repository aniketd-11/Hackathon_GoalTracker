package com.goaltracker.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.goaltracker.dto.*;
import com.goaltracker.model.*;
import com.goaltracker.service.Interface.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/tracker")
public class TrackerController {

    private final TrackerService trackerService;
    private final ExcelService excelService;

    @Autowired
    private ObjectMapper mapper;

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

    @PostMapping(value = "/add-trackerActionValue", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addTrackerActionValues(@RequestParam String actionValueDTOsJson,
                                                    @RequestParam int trackerId,
                                                    @RequestParam(required = false) String note,
                                                    @RequestParam(required = false) Map<String, MultipartFile> files) {
        try {
            List<ActionValueDTO> actionValueDTOs = mapper.readValue(actionValueDTOsJson,
                    mapper.getTypeFactory().constructCollectionType(List.class, ActionValueDTO.class));
            Map<Integer, MultipartFile> actionIdToFileMap = new HashMap<>();
            if (files != null) {
                for (Map.Entry<String, MultipartFile> entry : files.entrySet()) {
                    String key = entry.getKey();
                    if (key.startsWith("file-")) {
                        // Extract actionId from the key (e.g., "file-1" -> 1)
                        int actionId = Integer.parseInt(key.substring(5));
                        actionIdToFileMap.put(actionId, entry.getValue());
                    }
                }
            }
            trackerService.addTrackerActionValues(actionValueDTOs, trackerId,note,actionIdToFileMap);
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

    @PutMapping("/{trackerId}/rating")
    public ResponseEntity<?> updateTrackerRating(@PathVariable int trackerId, @RequestBody Rating rating){
        try {
            trackerService.updateGoalTrackerRating(trackerId, rating);
            return ResponseEntity.ok("Rating updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating rating: " + e.getMessage());
        }
    }

    @PostMapping("/{trackerId}/addNote")
    public ResponseEntity<?> addQnNotesToTracker(@PathVariable int trackerId, @RequestBody NoteRequestDTO dto){
        try {
            GoalTrackerDTO trackerData = trackerService.addNoteToTracker(trackerId, dto);
            Map<String, Object> response = new HashMap<>();
            response.put("message","Note added successfully");
            response.put("trackerData:",trackerData);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding note: " + e.getMessage());
        }
    }

    @PostMapping("addActionPlan")
    public ResponseEntity<?> addActionPlan(@RequestParam int trackerId, @RequestBody ActionPlanRequestDTO dto){
        try {
            ActionValueDTO actionData = trackerService.addActionPlanByTracker(trackerId, dto);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Data added successfully");
            response.put("actionData", actionData);
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Action not found: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid request: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding action plan: " + e.getMessage());
        }
    }
}
