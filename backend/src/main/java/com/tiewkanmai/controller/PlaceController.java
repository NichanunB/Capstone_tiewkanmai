package com.tiewkanmai.controller;

import com.tiewkanmai.dto.response.PlaceResponse;
import com.tiewkanmai.service.PlaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(
  origins = {"http://localhost:5173", "http://localhost:3000"},
  allowCredentials = "true",
  maxAge = 3600
)
@RestController
@RequestMapping("/api/places")
public class PlaceController {

    @Autowired
    private PlaceService placeService;

    @GetMapping
    public ResponseEntity<List<PlaceResponse>> getAllPlaces(
            @RequestParam(required = false) Long province,
            @RequestParam(required = false) Long category) {

        List<PlaceResponse> places;

        if (province != null && category != null) {
            places = placeService.getPlacesByProvinceIdAndCategoryId(province, category);
        } else if (province != null) {
            places = placeService.getPlacesByProvinceId(province);
        } else if (category != null) {
            places = placeService.getPlacesByCategoryId(category);
        } else {
            places = placeService.getAllPlaces();
        }

        return ResponseEntity.ok(places);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlaceResponse> getPlaceById(@PathVariable Long id) {
        PlaceResponse place = placeService.getPlaceById(id);
        if (place == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(place);
    }

    @GetMapping("/{id}/related")
    public ResponseEntity<List<PlaceResponse>> getRelatedPlaces(@PathVariable Long id) {
        List<PlaceResponse> relatedPlaces = placeService.getRelatedPlaces(id);
        return ResponseEntity.ok(relatedPlaces);
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<PlaceResponse>> getNearbyPlaces(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam(defaultValue = "5") Integer radius) {

        List<PlaceResponse> nearbyPlaces = placeService.getNearbyPlaces(lat, lng, radius);
        return ResponseEntity.ok(nearbyPlaces);
    }
}
