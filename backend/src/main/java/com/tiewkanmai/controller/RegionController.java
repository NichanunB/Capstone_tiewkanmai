package com.tiewkanmai.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tiewkanmai.model.Region;
import com.tiewkanmai.repository.RegionRepository;

import java.util.List;

@CrossOrigin(
  origins = {"http://localhost:5173", "http://localhost:3000"},
  allowCredentials = "true",
  maxAge = 3600
)
@RestController
@RequestMapping("/api/regions")
public class RegionController {
    @Autowired
    RegionRepository regionRepository;

    @GetMapping
    public ResponseEntity<?> getAllRegions() {
        List<Region> regions = regionRepository.findAll();
        return ResponseEntity.ok(regions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRegionById(@PathVariable Long id) {
        return regionRepository.findById(id)
                .map(region -> ResponseEntity.ok().body(region))
                .orElse(ResponseEntity.notFound().build());
    }
}
