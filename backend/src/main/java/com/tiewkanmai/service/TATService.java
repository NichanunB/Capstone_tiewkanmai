package com.tiewkanmai.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class TATService {

    @Value("${tat.api.key}")
    private String apiKey;

    @Value("${tat.api.baseUrl}")
    private String baseUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public TATService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Get places from TAT API
     * 
     * @param province Province name
     * @param category Category name
     * @param keyword  Search keyword
     * @return JSON response from TAT API
     */
    public JsonNode getPlaces(String province, String category, String keyword) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + apiKey);
            headers.set("Accept-Language", "TH");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(baseUrl + "places/search")
                    .queryParam("provinceName", province);

            if (category != null && !category.isEmpty()) {
                builder.queryParam("categories", category);
            }

            if (keyword != null && !keyword.isEmpty()) {
                builder.queryParam("keyword", keyword);
            }

            ResponseEntity<String> response = restTemplate.exchange(
                    builder.toUriString(),
                    HttpMethod.GET,
                    entity,
                    String.class);

            return objectMapper.readTree(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Get place details from TAT API
     * 
     * @param placeId TAT Place ID
     * @return JSON response from TAT API
     */
    public JsonNode getPlaceDetails(String placeId) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + apiKey);
            headers.set("Accept-Language", "TH");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    baseUrl + "attraction/" + placeId,
                    HttpMethod.GET,
                    entity,
                    String.class);

            return objectMapper.readTree(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Get restaurants from TAT API
     * 
     * @param location Location coordinates (latitude,longitude)
     * @param radius   Search radius in kilometers
     * @param cuisine  Cuisine type
     * @return JSON response from TAT API
     */
    public JsonNode getRestaurants(String location, Integer radius, String cuisine) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + apiKey);
            headers.set("Accept-Language", "TH");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(baseUrl + "restaurants")
                    .queryParam("location", location);

            if (radius != null) {
                builder.queryParam("radius", radius);
            }

            if (cuisine != null && !cuisine.isEmpty()) {
                builder.queryParam("cuisine_type", cuisine);
            }

            ResponseEntity<String> response = restTemplate.exchange(
                    builder.toUriString(),
                    HttpMethod.GET,
                    entity,
                    String.class);

            return objectMapper.readTree(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Get accommodations from TAT API
     * 
     * @param location Location coordinates (latitude,longitude)
     * @param radius   Search radius in kilometers
     * @param type     Accommodation type
     * @return JSON response from TAT API
     */
    public JsonNode getAccommodations(String location, Integer radius, String type) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + apiKey);
            headers.set("Accept-Language", "TH");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(baseUrl + "accommodation")
                    .queryParam("location", location);

            if (radius != null) {
                builder.queryParam("radius", radius);
            }

            if (type != null && !type.isEmpty()) {
                builder.queryParam("accommodation_type", type);
            }

            ResponseEntity<String> response = restTemplate.exchange(
                    builder.toUriString(),
                    HttpMethod.GET,
                    entity,
                    String.class);

            return objectMapper.readTree(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    
    /**
     * Generate a travel plan based on places retrieved from TAT API
     * 
     * @param province    Province name
     * @param categories  List of category names
     * @param days        Number of days for the travel plan
     * @return JSON structure with the generated travel plan
     */
    public JsonNode generateTravelPlan(String province, List<String> categories, int days) {
        try {
            // Collect places from all categories
            List<JsonNode> allPlaces = new ArrayList<>();
            
            for (String category : categories) {
                JsonNode places = getPlaces(province, category, null);
                if (places != null && places.has("result") && places.get("result").isArray()) {
                    for (JsonNode place : places.get("result")) {
                        allPlaces.add(place);
                    }
                }
            }
            
            // Create a plan structure
            ObjectMapper mapper = new ObjectMapper();
            JsonNode planNode = mapper.createObjectNode()
                    .put("province", province)
                    .put("days", days);
            
            // TODO: Implement more sophisticated planning algorithm
            // For now, just distribute places evenly across days
            
            return planNode;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}