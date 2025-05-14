package com.tiewkanmai.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.JsonNode;
import com.tiewkanmai.service.TATService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/tat")
public class TATController {
    @Autowired
    TATService tatService;

    @GetMapping("/places")
    public ResponseEntity<?> getPlaces(
            @RequestParam(required = true) String province,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String keyword) {
        
        JsonNode places = tatService.getPlaces(province, category, keyword);
        if (places == null) {
            return ResponseEntity.badRequest().body("Failed to fetch places from TAT API");
        }
        
        return ResponseEntity.ok(places);
    }

    @GetMapping("/place/{id}")
    public ResponseEntity<?> getPlaceDetails(@PathVariable String id) {
        JsonNode placeDetails = tatService.getPlaceDetails(id);
        if (placeDetails == null) {
            return ResponseEntity.badRequest().body("Failed to fetch place details from TAT API");
        }
        
        return ResponseEntity.ok(placeDetails);
    }

    @GetMapping("/restaurants")
    public ResponseEntity<?> getRestaurants(
            @RequestParam(required = true) String location,
            @RequestParam(required = false) Integer radius,
            @RequestParam(required = false) String cuisine) {
        
        JsonNode restaurants = tatService.getRestaurants(location, radius, cuisine);
        if (restaurants == null) {
            return ResponseEntity.badRequest().body("Failed to fetch restaurants from TAT API");
        }
        
        return ResponseEntity.ok(restaurants);
    }

    @GetMapping("/accommodations")
    public ResponseEntity<?> getAccommodations(
            @RequestParam(required = true) String location,
            @RequestParam(required = false) Integer radius,
            @RequestParam(required = false) String type) {
        
        JsonNode accommodations = tatService.getAccommodations(location, radius, type);
        if (accommodations == null) {
            return ResponseEntity.badRequest().body("Failed to fetch accommodations from TAT API");
        }
        
        return ResponseEntity.ok(accommodations);
    }
}