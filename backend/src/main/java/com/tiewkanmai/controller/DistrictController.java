package com.tiewkanmai.controller;

import com.tiewkanmai.model.District;
import com.tiewkanmai.repository.DistrictRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:3000"}, allowCredentials = "true", maxAge = 3600)
@RestController
@RequestMapping("/api/districts")
public class DistrictController {
    @Autowired
    private DistrictRepository districtRepository;

    @GetMapping
    public ResponseEntity<List<District>> getDistrictsByProvince(@RequestParam Long provinceId) {
        List<District> districts = districtRepository.findByProvince_Id(provinceId);
        return ResponseEntity.ok(districts);
    }
} 