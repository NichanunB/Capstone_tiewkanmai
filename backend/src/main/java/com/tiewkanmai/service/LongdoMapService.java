package com.tiewkanmai.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class LongdoMapService {

    @Value("${longdo.map.api.key}")
    private String apiKey;

    @Value("${longdo.search.api.url}")
    private String searchApiUrl;

    @Value("${longdo.route.api.url}")
    private String routeApiUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public LongdoMapService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * ค้นหาสถานที่ใน Longdo Map
     * 
     * @param keyword คำค้นหา (ชื่อสถานที่)
     * @param lon ลองจิจูด (ถ้ามี)
     * @param lat ละติจูด (ถ้ามี)
     * @param limit จำนวนผลลัพธ์สูงสุด
     * @return JsonNode ผลการค้นหา
     */
    public JsonNode searchPlaces(String keyword, Double lon, Double lat, Integer limit) {
        try {
            UriComponentsBuilder builder = UriComponentsBuilder
                .fromHttpUrl(searchApiUrl)
                .queryParam("key", apiKey)
                .queryParam("keyword", keyword);
            
            if (lon != null && lat != null) {
                builder.queryParam("lon", lon)
                       .queryParam("lat", lat);
            }
            
            if (limit != null) {
                builder.queryParam("limit", limit);
            }
            
            ResponseEntity<String> response = restTemplate.getForEntity(
                builder.toUriString(), 
                String.class
            );
            
            return objectMapper.readTree(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * ค้นหาสถานที่ท่องเที่ยวตามจังหวัด
     * 
     * @param province ชื่อจังหวัด
     * @param category ประเภทสถานที่ (ถ้ามี)
     * @param limit จำนวนผลลัพธ์สูงสุด
     * @return JsonNode ผลการค้นหา
     */
    public JsonNode getTouristPlacesByProvince(String province, String category, Integer limit) {
        try {
            // สร้างคำค้นหาที่เหมาะสม
            String keyword = province;
            if (category != null && !category.isEmpty()) {
                keyword += " " + category;
            }
            
            UriComponentsBuilder builder = UriComponentsBuilder
                .fromHttpUrl(searchApiUrl)
                .queryParam("key", apiKey)
                .queryParam("keyword", keyword)
                .queryParam("tag", "tourism"); // ระบุ tag เป็น tourism เพื่อค้นหาสถานที่ท่องเที่ยว
            
            if (limit != null) {
                builder.queryParam("limit", limit);
            }
            
            ResponseEntity<String> response = restTemplate.getForEntity(
                builder.toUriString(), 
                String.class
            );
            
            // แปลงรูปแบบผลลัพธ์ให้คล้ายกับ TAT API เดิม
            JsonNode results = objectMapper.readTree(response.getBody());
            ObjectNode formattedResponse = objectMapper.createObjectNode();
            formattedResponse.put("status", 200);
            formattedResponse.set("result", results.get("data"));
            
            return formattedResponse;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * ดึงรายละเอียดของสถานที่
     * 
     * @param id รหัสสถานที่จาก Longdo Map
     * @return JsonNode รายละเอียดสถานที่
     */
    public JsonNode getPlaceDetails(String id) {
        try {
            UriComponentsBuilder builder = UriComponentsBuilder
                .fromHttpUrl(searchApiUrl + "/details")
                .queryParam("key", apiKey)
                .queryParam("id", id);
            
            ResponseEntity<String> response = restTemplate.getForEntity(
                builder.toUriString(), 
                String.class
            );
            
            return objectMapper.readTree(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * คำนวณเส้นทางระหว่างสถานที่
     * 
     * @param origin จุดเริ่มต้น (ละติจูด,ลองจิจูด)
     * @param destination จุดหมาย (ละติจูด,ลองจิจูด)
     * @param mode รูปแบบการเดินทาง (car, motorcycle, bike, foot)
     * @return JsonNode ข้อมูลเส้นทาง
     */
    public JsonNode getRoute(String origin, String destination, String mode) {
        try {
            UriComponentsBuilder builder = UriComponentsBuilder
                .fromHttpUrl(routeApiUrl)
                .queryParam("key", apiKey)
                .queryParam("from", origin)
                .queryParam("to", destination);
            
            if (mode != null) {
                builder.queryParam("mode", mode);
            }
            
            ResponseEntity<String> response = restTemplate.getForEntity(
                builder.toUriString(), 
                String.class
            );
            
            return objectMapper.readTree(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    
    /**
     * สร้างแผนการท่องเที่ยวตามจังหวัดและหมวดหมู่
     * 
     * @param province ชื่อจังหวัด
     * @param categories รายการหมวดหมู่
     * @param days จำนวนวัน
     * @return JsonNode แผนการท่องเที่ยว
     */
    public JsonNode generateTravelPlan(String province, List<String> categories, int days) {
        try {
            // รวบรวมสถานที่จากแต่ละหมวดหมู่
            List<JsonNode> allPlaces = new ArrayList<>();
            
            for (String category : categories) {
                JsonNode places = getTouristPlacesByProvince(province, category, 10);
                
                if (places != null && places.has("result") && places.get("result").isArray()) {
                    for (JsonNode place : places.get("result")) {
                        allPlaces.add(place);
                    }
                }
            }
            
            // สร้างแผนการท่องเที่ยว
            ObjectNode planNode = objectMapper.createObjectNode();
            planNode.put("province", province);
            planNode.put("days", days);
            
            // จัดสรรสถานที่ตามวัน
            ArrayNode daysNode = objectMapper.createArrayNode();
            int placesPerDay = Math.max(1, allPlaces.size() / days);
            
            for (int i = 0; i < days; i++) {
                ObjectNode dayNode = objectMapper.createObjectNode();
                dayNode.put("day", i + 1);
                
                ArrayNode placesNode = objectMapper.createArrayNode();
                int startIdx = i * placesPerDay;
                int endIdx = Math.min(startIdx + placesPerDay, allPlaces.size());
                
                for (int j = startIdx; j < endIdx; j++) {
                    if (j < allPlaces.size()) {
                        placesNode.add(allPlaces.get(j));
                    }
                }
                
                dayNode.set("places", placesNode);
                daysNode.add(dayNode);
            }
            
            planNode.set("itinerary", daysNode);
            return planNode;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}