package com.tiewkanmai.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.JsonNode;
import com.tiewkanmai.service.LongdoMapService;

import java.util.Arrays;
import java.util.List;

@CrossOrigin(
  origins = {"http://localhost:5173", "http://localhost:3000"},
  allowCredentials = "true",
  maxAge = 3600
)
@RestController
@RequestMapping("/api/maps")
public class LongdoMapController {
    @Autowired
    LongdoMapService longdoMapService;

    @GetMapping("/places")
    public ResponseEntity<?> searchPlaces(
            @RequestParam(required = true) String keyword,
            @RequestParam(required = false) Double lon,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false, defaultValue = "10") Integer limit) {
        
        JsonNode places = longdoMapService.searchPlaces(keyword, lon, lat, limit);
        if (places == null) {
            return ResponseEntity.badRequest().body("Failed to fetch places from Longdo Map API");
        }
        
        return ResponseEntity.ok(places);
    }

    @GetMapping("/tourist-places")
    public ResponseEntity<?> getTouristPlaces(
            @RequestParam(required = true) String province,
            @RequestParam(required = false) String category,
            @RequestParam(required = false, defaultValue = "10") Integer limit) {
        
        JsonNode places = longdoMapService.getTouristPlacesByProvince(province, category, limit);
        if (places == null) {
            return ResponseEntity.badRequest().body("Failed to fetch tourist places from Longdo Map API");
        }
        
        return ResponseEntity.ok(places);
    }

    @GetMapping("/place/{id}")
    public ResponseEntity<?> getPlaceDetails(@PathVariable String id) {
        JsonNode placeDetails = longdoMapService.getPlaceDetails(id);
        if (placeDetails == null) {
            return ResponseEntity.badRequest().body("Failed to fetch place details from Longdo Map API");
        }
        
        return ResponseEntity.ok(placeDetails);
    }

    @GetMapping("/route")
    public ResponseEntity<?> getRoute(
            @RequestParam(required = true) String origin,
            @RequestParam(required = true) String destination,
            @RequestParam(required = false, defaultValue = "car") String mode) {
        
        JsonNode route = longdoMapService.getRoute(origin, destination, mode);
        if (route == null) {
            return ResponseEntity.badRequest().body("Failed to fetch route from Longdo Map API");
        }
        
        return ResponseEntity.ok(route);
    }
    
    @GetMapping("/generate-plan")
    public ResponseEntity<?> generatePlan(
            @RequestParam(required = true) String province,
            @RequestParam(required = false) String categories,
            @RequestParam(required = true) Integer days) {
        
        List<String> categoryList = categories != null ? 
                Arrays.asList(categories.split(",")) : 
                Arrays.asList("ท่องเที่ยว", "วัฒนธรรม");
        
        JsonNode plan = longdoMapService.generateTravelPlan(province, categoryList, days);
        if (plan == null) {
            return ResponseEntity.badRequest().body("Failed to generate travel plan");
        }
        
        return ResponseEntity.ok(plan);
    }
}