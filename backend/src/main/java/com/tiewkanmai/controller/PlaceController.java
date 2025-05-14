package com.tiewkanmai.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tiewkanmai.dto.response.PlaceResponse;
import com.tiewkanmai.service.PlaceService;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/places")
public class PlaceController {
    @Autowired
    PlaceService placeService;

    @GetMapping
    public ResponseEntity<?> getAllPlaces(
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
    public ResponseEntity<?> getPlaceById(@PathVariable Long id) {
        PlaceResponse place = placeService.getPlaceById(id);
        if (place == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(place);
    }
    
    /**
     * ดึงข้อมูลสถานที่ที่เกี่ยวข้องกับสถานที่ที่ระบุ (แนะนำโดย AI)
     * 
     * @param id รหัสสถานที่
     * @return รายการสถานที่ที่เกี่ยวข้อง
     */
    @GetMapping("/{id}/related")
    public ResponseEntity<?> getRelatedPlaces(@PathVariable Long id) {
        List<PlaceResponse> relatedPlaces = placeService.getRelatedPlaces(id);
        return ResponseEntity.ok(relatedPlaces);
    }

    /**
     * ดึงข้อมูลสถานที่ใกล้เคียงตามพิกัด
     * 
     * @param lat ละติจูด
     * @param lng ลองจิจูด
     * @param radius รัศมีในกิโลเมตร (ค่าเริ่มต้น 5 กม.)
     * @return รายการสถานที่ใกล้เคียง
     */
    @GetMapping("/nearby")
    public ResponseEntity<?> getNearbyPlaces(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam(required = false, defaultValue = "5") Integer radius) {
        List<PlaceResponse> nearbyPlaces = placeService.getNearbyPlaces(lat, lng, radius);
        return ResponseEntity.ok(nearbyPlaces);
    }
}
