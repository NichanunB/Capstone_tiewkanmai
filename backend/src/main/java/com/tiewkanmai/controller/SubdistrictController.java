package com.tiewkanmai.controller;

import com.tiewkanmai.model.Subdistrict;
import com.tiewkanmai.repository.SubdistrictRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:3000"}, allowCredentials = "true", maxAge = 3600)
@RestController
@RequestMapping("/api/subdistricts")
public class SubdistrictController {
    @Autowired
    private SubdistrictRepository subdistrictRepository;

    @GetMapping
    public ResponseEntity<List<Subdistrict>> getSubdistrictsByDistrict(@RequestParam Long districtId) {
        List<Subdistrict> subdistricts = subdistrictRepository.findByDistrict_Id(districtId);
        return ResponseEntity.ok(subdistricts);
    }
} 