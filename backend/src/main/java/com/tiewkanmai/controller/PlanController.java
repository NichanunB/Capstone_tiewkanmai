package com.tiewkanmai.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tiewkanmai.dto.request.PlanSaveRequest;
import com.tiewkanmai.dto.response.MessageResponse;
import com.tiewkanmai.dto.response.PlanResponse;
import com.tiewkanmai.security.services.UserDetailsImpl;
import com.tiewkanmai.service.PlanService;

import jakarta.validation.Valid;

@CrossOrigin(
  origins = {"http://localhost:5173", "http://localhost:3000"},
  allowCredentials = "true",
  maxAge = 3600
)
@RestController
@RequestMapping("/api/plans")
public class PlanController {
    @Autowired
    private PlanService planService;

    // GET /api/plans - แสดงแผนท่องเที่ยวของ user
    @GetMapping
    public ResponseEntity<List<PlanResponse>> getUserPlans(Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        List<PlanResponse> plans = planService.getUserPlans(userDetails.getId());
        return ResponseEntity.ok(plans);
    }

    // POST /api/plans - สร้างแผนใหม่
    @PostMapping
    public ResponseEntity<MessageResponse> savePlan(
        Authentication auth,
        @Valid @RequestBody PlanSaveRequest request
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        Long planId = planService.savePlan(request, userDetails.getId());
        if (planId == null) {
            return ResponseEntity
                .badRequest()
                .body(new MessageResponse("Failed to save plan"));
        }
        return ResponseEntity
            .ok(new MessageResponse("Plan saved successfully with ID: " + planId));
    }

    // GET /api/plans/{id} - ดูแผนท่องเที่ยวแต่ละอัน
    @GetMapping("/{id}")
    public ResponseEntity<PlanResponse> getPlanById(
        @PathVariable Long id,
        Authentication auth
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        PlanResponse plan = planService.getPlanById(id, userDetails.getId());
        if (plan == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(plan);
    }

    // PUT /api/plans/{id} - อัปเดตแผนท่องเที่ยว
    @PutMapping("/{id}")
    public ResponseEntity<MessageResponse> updatePlan(
        @PathVariable Long id,
        Authentication auth,
        @Valid @RequestBody PlanSaveRequest request
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        Long updatedId = planService.updatePlan(id, request, userDetails.getId());
        if (updatedId == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new MessageResponse("Plan updated successfully"));
    }

    // DELETE /api/plans/{id} - ลบแผนท่องเที่ยว
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deletePlan(
        @PathVariable Long id,
        Authentication auth
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        boolean deleted = planService.deletePlan(id, userDetails.getId());
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new MessageResponse("Plan deleted successfully"));
    }
}
