package com.tiewkanmai.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tiewkanmai.model.Category;
import com.tiewkanmai.model.Place;
import com.tiewkanmai.model.Province;
import com.tiewkanmai.repository.CategoryRepository;
import com.tiewkanmai.repository.PlaceRepository;
import com.tiewkanmai.repository.ProvinceRepository;

/**
 * บริการแนะนำสถานที่ด้วย AI
 * คลาสนี้ใช้เทคนิคต่างๆ ในการแนะนำสถานที่ เช่น
 * - Content-Based Filtering: แนะนำตามเนื้อหาและคุณลักษณะของสถานที่
 * - Collaborative Filtering: แนะนำตามความนิยมและพฤติกรรมของผู้ใช้
 * - Hybrid Approach: ผสมผสานวิธีการทั้งสองแบบ
 */
@Service
public class AIPlaceRecommendationService {

    @Autowired
    private PlaceRepository placeRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProvinceRepository provinceRepository;

    /**
     * แนะนำสถานที่ที่เกี่ยวข้องกับสถานที่ที่กำลังดูอยู่
     * 
     * @param placeId รหัสสถานที่ที่กำลังดู
     * @return รายการสถานที่ที่แนะนำ
     */
    public List<Place> getRelatedPlaces(Long placeId) {
        // 1. ดึงข้อมูลสถานที่ปัจจุบัน
        Optional<Place> currentPlaceOpt = placeRepository.findById(placeId);
        if (!currentPlaceOpt.isPresent()) {
            return new ArrayList<>();
        }
        
        Place currentPlace = currentPlaceOpt.get();
        Set<Province> provinces = currentPlace.getProvinces();
        Category category = currentPlace.getCategory();
        
        // 2. เก็บคะแนนความเกี่ยวข้องของแต่ละสถานที่
        Map<Place, Double> placeScores = new HashMap<>();
        
        // 3. ดึงสถานที่ทั้งหมดที่จะนำมาพิจารณา
        List<Place> allPlaces = placeRepository.findAll();
        
        // 4. คำนวณคะแนนความเกี่ยวข้องสำหรับแต่ละสถานที่
        for (Place place : allPlaces) {
            // ข้ามสถานที่ปัจจุบัน
            if (place.getId().equals(placeId)) {
                continue;
            }
            
            double score = 0.0;
            
            // 4.1 คะแนนตามหมวดหมู่
            if (category != null && place.getCategory() != null && 
                category.getId().equals(place.getCategory().getId())) {
                score += 5.0;  // ให้น้ำหนักมากกับหมวดหมู่เดียวกัน
            }
            
            // 4.2 คะแนนตามจังหวัด
            if (provinces != null && !provinces.isEmpty() && place.getProvinces() != null) {
                for (Province province : provinces) {
                    if (place.getProvinces().contains(province)) {
                        score += 3.0;  // ให้น้ำหนักกับจังหวัดเดียวกัน
                        break;
                    }
                }
            }
            
            // 4.3 คะแนนตามความนิยม (rating)
            if (place.getRating() != null) {
                score += place.getRating().doubleValue() * 0.5;  // คะแนนเพิ่มตาม rating
            }
            
            // 4.4 ปรับคะแนนตามระยะทาง (ถ้ามีข้อมูล latitude/longitude)
            if (currentPlace.getLatitude() != null && currentPlace.getLongitude() != null &&
                place.getLatitude() != null && place.getLongitude() != null) {
                
                double distance = calculateDistance(
                    currentPlace.getLatitude(), currentPlace.getLongitude(),
                    place.getLatitude(), place.getLongitude());
                
                // ถ้าอยู่ใกล้กัน (ในรัศมี 10 กม.) ให้คะแนนเพิ่ม
                if (distance < 10.0) {
                    score += (10.0 - distance) * 0.2;  // ยิ่งใกล้ยิ่งได้คะแนนมาก
                }
            }
            
            // 4.5 คะแนนตามความคล้ายคลึงของเนื้อหา (คำอธิบาย)
            double contentSimilarity = calculateContentSimilarity(currentPlace, place);
            score += contentSimilarity * 2.0;
            
            // เก็บคะแนนลงในแฮชแมป
            placeScores.put(place, score);
        }
        
        // 5. เรียงลำดับตามคะแนนและเลือกสถานที่ที่ดีที่สุด
        List<Place> recommendedPlaces = placeScores.entrySet().stream()
                .sorted(Map.Entry.<Place, Double>comparingByValue().reversed())
                .limit(3)  // จำกัดจำนวนผลลัพธ์
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
        
        return recommendedPlaces;
    }

    /**
     * ใช้ Content-Based Filtering เพื่อแนะนำสถานที่
     */
    private double calculateContentSimilarity(Place place1, Place place2) {
        double similarity = 0.0;
        
        // คำนวณความคล้ายคลึงระหว่างสถานที่ 2 แห่ง โดยพิจารณาคุณลักษณะต่างๆ
        
        // 1. เปรียบเทียบหมวดหมู่
        if (place1.getCategory() != null && place2.getCategory() != null) {
            if (place1.getCategory().getId().equals(place2.getCategory().getId())) {
                similarity += 1.0;
            }
        }
        
        // 2. เปรียบเทียบจังหวัด
        if (place1.getProvinces() != null && place2.getProvinces() != null) {
            Set<Long> provinces1 = place1.getProvinces().stream()
                    .map(Province::getId)
                    .collect(Collectors.toSet());
            
            for (Province province : place2.getProvinces()) {
                if (provinces1.contains(province.getId())) {
                    similarity += 1.0;
                    break;
                }
            }
        }
        
        // 3. เปรียบเทียบคำอธิบาย (ถ้ามีเวลาจะใช้ NLP ที่ซับซ้อนกว่านี้)
        if (place1.getDescription() != null && place2.getDescription() != null) {
            // ตัวอย่างง่ายๆ: นับคำที่ซ้ำกัน
            Set<String> words1 = tokenizeDescription(place1.getDescription());
            Set<String> words2 = tokenizeDescription(place2.getDescription());
            
            // นับคำที่ซ้ำกัน
            Set<String> commonWords = new HashSet<>(words1);
            commonWords.retainAll(words2);
            
            // คำนวณ Jaccard similarity
            if (!words1.isEmpty() || !words2.isEmpty()) {
                Set<String> allWords = new HashSet<>(words1);
                allWords.addAll(words2);
                
                similarity += (double) commonWords.size() / allWords.size();
            }
        }
        
        return similarity;
    }
    
    /**
     * แยกคำจากคำอธิบาย (อย่างง่าย)
     */
    private Set<String> tokenizeDescription(String description) {
        // ในโลกจริงควรใช้ Thai NLP library
        // ตัวอย่างนี้แค่แยกคำอย่างง่าย
        return Arrays.stream(description.toLowerCase().split("\\s+"))
                .filter(word -> word.length() > 3)  // กรองคำสั้นๆ ออก
                .collect(Collectors.toSet());
    }
    
    /**
     * คำนวณระยะทางระหว่างสองพิกัด (Haversine formula)
     */
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // รัศมีของโลกในกิโลเมตร
        
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c; // ระยะทางในกิโลเมตร
    }
}