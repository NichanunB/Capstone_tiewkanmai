package com.tiewkanmai.service;

import com.tiewkanmai.dto.response.PlaceResponse;
import com.tiewkanmai.model.Category;
import com.tiewkanmai.model.Place;
import com.tiewkanmai.model.Province;
import com.tiewkanmai.repository.CategoryRepository;
import com.tiewkanmai.repository.PlaceRepository;
import com.tiewkanmai.repository.ProvinceRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PlaceService {

    @Autowired
    private PlaceRepository placeRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProvinceRepository provinceRepository;

    @Autowired
    private AIPlaceRecommendationService aiRecommendationService;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${longdo.map.api.key}")
    private String longdoApiKey;

    public List<PlaceResponse> getAllPlaces() {
        return convertToPlaceResponseList(placeRepository.findAll());
    }

    public PlaceResponse getPlaceById(Long id) {
        return placeRepository.findById(id)
                .map(this::convertToPlaceResponse)
                .orElse(null);
    }

    public List<PlaceResponse> getPlacesByProvinceId(Long provinceId) {
        return convertToPlaceResponseList(placeRepository.findAllByProvinceId(provinceId));
    }

    public List<PlaceResponse> getPlacesByCategoryId(Long categoryId) {
        return convertToPlaceResponseList(placeRepository.findAllByCategoryId(categoryId));
    }

    public List<PlaceResponse> getPlacesByProvinceIdAndCategoryId(Long provinceId, Long categoryId) {
        return convertToPlaceResponseList(placeRepository.findAllByProvinceIdAndCategoryId(provinceId, categoryId));
    }

    public Place createPlace(Place place) {
        return placeRepository.save(place);
    }

    public Place updatePlace(Long id, Place updatedPlace) {
        if (!placeRepository.existsById(id)) return null;
        updatedPlace.setId(id);
        return placeRepository.save(updatedPlace);
    }

    public boolean deletePlace(Long id) {
        if (!placeRepository.existsById(id)) return false;
        placeRepository.deleteById(id);
        return true;
    }

    public List<PlaceResponse> getRelatedPlaces(Long placeId) {
        return convertToPlaceResponseList(aiRecommendationService.getRelatedPlaces(placeId));
    }

    public List<PlaceResponse> getNearbyPlaces(Double latitude, Double longitude, Integer radius) {
        return convertToPlaceResponseList(placeRepository.findNearby(latitude, longitude, radius));
    }

    private PlaceResponse convertToPlaceResponse(Place place) {
        PlaceResponse response = new PlaceResponse();
        response.setId(place.getId());
        response.setName(place.getName());
        response.setDescription(place.getDescription());

        // ✅ ดึงรูปจาก Longdo API สด
        response.setImage(fetchImageFromLongdo(place.getName()));

        response.setRating(place.getRating());
        response.setCategory(place.getCategory() != null ? place.getCategory().getName() : null);
        response.setMap(place.getMap());
        response.setCost(place.getCost());
        response.setLatitude(place.getLatitude());
        response.setLongitude(place.getLongitude());
        response.setAddress(place.getAddress());

        // จังหวัดแรก (ถ้ามี)
        place.getProvinces().stream().findFirst().ifPresent(p -> response.setProvince(p.getName()));

        // หมวดหมู่
        if (place.getCategory() != null) {
            response.setCategories(Collections.singletonList(place.getCategory().getName()));
        } else {
            response.setCategories(Collections.emptyList());
        }

        return response;
    }

    private List<PlaceResponse> convertToPlaceResponseList(List<Place> places) {
        return places.stream()
                .map(this::convertToPlaceResponse)
                .collect(Collectors.toList());
    }

    /**
     * ดึงภาพจาก Longdo API โดยตรงด้วยชื่อสถานที่
     */
    private String fetchImageFromLongdo(String name) {
        try {
            String encodedName = URLEncoder.encode(name, StandardCharsets.UTF_8);
            String url = "https://api.longdo.com/map/services?name=" + encodedName + "&key=" + longdoApiKey;

            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("data")) {
                List<Map<String, Object>> dataList = (List<Map<String, Object>>) response.get("data");
                if (!dataList.isEmpty() && dataList.get(0).containsKey("pic")) {
                    return (String) dataList.get(0).get("pic");
                }
            }
        } catch (Exception e) {
            System.out.println("⚠️ Longdo API error for " + name + ": " + e.getMessage());
        }

        return "https://via.placeholder.com/400x300?text=No+Image";
    }
}
