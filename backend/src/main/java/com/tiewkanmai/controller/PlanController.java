package com.tiewkanmai.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.JsonNode;
import com.tiewkanmai.dto.request.PlanGenerateRequest;
import com.tiewkanmai.dto.request.PlanSaveRequest;
import com.tiewkanmai.dto.response.MessageResponse;
import com.tiewkanmai.dto.response.PlanResponse;
import com.tiewkanmai.security.services.UserDetailsImpl;
import com.tiewkanmai.service.PlanService;

import jakarta.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/plans")
public class PlanController {
    @Autowired
    PlanService planService;

    @PostMapping("/generate")
    public ResponseEntity<?> generatePlan(@Valid @RequestBody PlanGenerateRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        
        JsonNode plan = planService.generatePlan(request, userDetails.getId());
        if (plan == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Failed to generate plan"));
        }
        
        return ResponseEntity.ok(plan);
    }

    @PostMapping
    public ResponseEntity<?> savePlan(@Valid @RequestBody PlanSaveRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        
        Long planId = planService.savePlan(request, userDetails.getId());
        if (planId == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Failed to save plan"));
        }
        
        return ResponseEntity.ok(new MessageResponse("Plan saved successfully with ID: " + planId));
    }

    @GetMapping
    public ResponseEntity<?> getUserPlans() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        
        List<PlanResponse> plans = planService.getUserPlans(userDetails.getId());
        return ResponseEntity.ok(plans);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPlanById(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        
        PlanResponse plan = planService.getPlanById(id, userDetails.getId());
        if (plan == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(plan);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePlan(@PathVariable Long id, @Valid @RequestBody PlanSaveRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        
        Long planId = planService.updatePlan(id, request, userDetails.getId());
        if (planId == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(new MessageResponse("Plan updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePlan(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        
        boolean deleted = planService.deletePlan(id, userDetails.getId());
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(new MessageResponse("Plan deleted successfully"));
    }
}