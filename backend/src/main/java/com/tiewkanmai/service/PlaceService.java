package com.tiewkanmai.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tiewkanmai.dto.response.PlaceResponse;
import com.tiewkanmai.model.Place;
import com.tiewkanmai.model.Province;
import com.tiewkanmai.repository.CategoryRepository;
import com.tiewkanmai.repository.PlaceRepository;
import com.tiewkanmai.repository.ProvinceRepository;

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

    /**
     * Get all places
     * 
     * @return List of PlaceResponse
     */
    public List<PlaceResponse> getAllPlaces() {
        List<Place> places = placeRepository.findAll();
        return convertToPlaceResponseList(places);
    }

    /**
     * Get place by ID
     * 
     * @param id Place ID
     * @return PlaceResponse
     */
    public PlaceResponse getPlaceById(Long id) {
        Optional<Place> place = placeRepository.findById(id);
        if (!place.isPresent()) {
            return null;
        }
        return convertToPlaceResponse(place.get());
    }

    /**
     * Get places by province ID
     * 
     * @param provinceId Province ID
     * @return List of PlaceResponse
     */
    public List<PlaceResponse> getPlacesByProvinceId(Long provinceId) {
        List<Place> places = placeRepository.findAllByProvinceId(provinceId);
        return convertToPlaceResponseList(places);
    }

    /**
     * Get places by category ID
     * 
     * @param categoryId Category ID
     * @return List of PlaceResponse
     */
    public List<PlaceResponse> getPlacesByCategoryId(Long categoryId) {
        List<Place> places = placeRepository.findAllByCategoryId(categoryId);
        return convertToPlaceResponseList(places);
    }

    /**
     * Get places by province ID and category ID
     * 
     * @param provinceId Province ID
     * @param categoryId Category ID
     * @return List of PlaceResponse
     */
    public List<PlaceResponse> getPlacesByProvinceIdAndCategoryId(Long provinceId, Long categoryId) {
        List<Place> places = placeRepository.findAllByProvinceIdAndCategoryId(provinceId, categoryId);
        return convertToPlaceResponseList(places);
    }

    /**
     * Create new place
     * 
     * @param place Place object
     * @return Created Place
     */
    public Place createPlace(Place place) {
        return placeRepository.save(place);
    }

    /**
     * Update existing place
     * 
     * @param id    Place ID
     * @param place Updated Place object
     * @return Updated Place
     */
    public Place updatePlace(Long id, Place place) {
        Optional<Place> existingPlace = placeRepository.findById(id);
        if (!existingPlace.isPresent()) {
            return null;
        }

        place.setId(id);
        return placeRepository.save(place);
    }

    /**
     * Delete place by ID
     * 
     * @param id Place ID
     * @return true if deleted, false otherwise
     */
    public boolean deletePlace(Long id) {
        Optional<Place> place = placeRepository.findById(id);
        if (!place.isPresent()) {
            return false;
        }

        placeRepository.deleteById(id);
        return true;
    }
    
    /**
     * แนะนำสถานที่ที่เกี่ยวข้องกับสถานที่ที่กำลังดู โดยใช้ AI
     * 
     * @param placeId รหัสสถานที่ที่กำลังดู
     * @return List<PlaceResponse> รายการสถานที่ที่เกี่ยวข้อง
     */
    public List<PlaceResponse> getRelatedPlaces(Long placeId) {
        // ใช้ AI Service เพื่อแนะนำสถานที่
        List<Place> relatedPlaces = aiRecommendationService.getRelatedPlaces(placeId);
        return convertToPlaceResponseList(relatedPlaces);
    }

    /**
     * แนะนำสถานที่ใกล้เคียงตามพิกัด
     * 
     * @param latitude พิกัดละติจูด
     * @param longitude พิกัดลองจิจูด
     * @param radius รัศมีในกิโลเมตร
     * @return List<PlaceResponse> รายการสถานที่ใกล้เคียง
     */
    public List<PlaceResponse> getNearbyPlaces(Double latitude, Double longitude, Integer radius) {
        List<Place> nearbyPlaces = placeRepository.findNearby(latitude, longitude, radius);
        return convertToPlaceResponseList(nearbyPlaces);
    }

    /**
     * Convert Place to PlaceResponse
     * 
     * @param place Place object
     * @return PlaceResponse
     */
    private PlaceResponse convertToPlaceResponse(Place place) {
        PlaceResponse response = new PlaceResponse();
        response.setId(place.getId());
        response.setName(place.getName());
        response.setDescription(place.getDescription());
        response.setImage(place.getImg());
        response.setRating(place.getRating());
        response.setCategory(place.getCategory() != null ? place.getCategory().getName() : null);
        response.setMap(place.getMap());
        response.setCost(place.getCost());
        response.setLatitude(place.getLatitude());
        response.setLongitude(place.getLongitude());
        response.setAddress(place.getAddress());

        // เพิ่มข้อมูลจังหวัด
        if (place.getProvinces() != null && !place.getProvinces().isEmpty()) {
            Province province = place.getProvinces().iterator().next();
            response.setProvince(province.getName());
        }

        // เพิ่มข้อมูลหมวดหมู่
        // (ในตัวอย่างนี้สมมติว่าสถานที่มีหมวดหมู่เดียว ในความจริงอาจมีหลายหมวดหมู่)
        List<String> categories = new ArrayList<>();
        if (place.getCategory() != null) {
            categories.add(place.getCategory().getName());
        }
        response.setCategories(categories);

        return response;
    }

    /**
     * Convert List<Place> to List<PlaceResponse>
     * 
     * @param places List of Place objects
     * @return List of PlaceResponse
     */
    private List<PlaceResponse> convertToPlaceResponseList(List<Place> places) {
        return places.stream()
                .map(this::convertToPlaceResponse)
                .collect(Collectors.toList());
    }
}