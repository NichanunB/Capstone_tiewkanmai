package com.tiewkanmai.service;

import com.tiewkanmai.model.Category;
import com.tiewkanmai.model.Place;
import com.tiewkanmai.model.Province;
import com.tiewkanmai.repository.CategoryRepository;
import com.tiewkanmai.repository.PlaceRepository;
import com.tiewkanmai.repository.ProvinceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class AttractionImporterService {

    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    private PlaceRepository placeRepository;

    @Autowired
    private ProvinceRepository provinceRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${longdo.map.api.key}")
    private String longdoApiKey;

    /**
     * ดึงข้อมูลจากตาราง attractions และ import เข้า entity Place พร้อม province/category + รูป
     */
    public void importFromAttractions() {
        String sql = "SELECT * FROM attractions";
        List<Map<String, Object>> rows = jdbc.queryForList(sql);

        for (Map<String, Object> row : rows) {
            String name = (String) row.get("ATT_NAME_TH");
            String nameEn = (String) row.get("ATT_NAME_EN");
            String provinceName = (String) row.get("PROVINCE_NAME_TH");
            String district = (String) row.get("DISTRICT_NAME_TH");
            String subdistrict = (String) row.get("SUBDISTRICT_NAME_TH");
            String categoryName = (String) row.get("ATTR_CATAGORY_TH");
            String subCategory = (String) row.get("ATTR_SUB_TYPE_TH");
            Double lat = row.get("Latitude") != null ? ((Number) row.get("Latitude")).doubleValue() : null;
            Double lng = row.get("Longitude") != null ? ((Number) row.get("Longitude")).doubleValue() : null;

            // ✅ แก้ findByName → findFirstByName
            Category category = categoryRepository.findFirstByName(categoryName).orElse(null);
            if (category == null) {
                category = new Category(categoryName);
                category = categoryRepository.save(category);
            }

            Province province = provinceRepository.findFirstByName(provinceName).orElse(null);
            if (province == null) {
                province = new Province(provinceName);
                province = provinceRepository.save(province);
            }

            // ✅ ดึงรูปภาพจาก Longdo
            String imgUrl = fetchImageFromLongdo(name);
            if (imgUrl == null || imgUrl.isEmpty()) {
                imgUrl = "https://via.placeholder.com/400x300?text=No+Image";
            }

            // ✅ สร้าง Place ใหม่
            Place place = new Place();
            place.setName(name);
            place.setImg(imgUrl);
            place.setDescription(null);
            place.setRating(BigDecimal.ZERO);
            place.setCategory(category);
            place.setMap(null);
            place.setCost(BigDecimal.ZERO);
            place.setLatitude(lat);
            place.setLongitude(lng);
            place.setAddress(district + ", " + subdistrict);
            place.setProvinces(new HashSet<>(Collections.singletonList(province)));

            placeRepository.save(place);
        }
    }

    /**
     * ดึงภาพจาก Longdo API ตามชื่อสถานที่
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
        return null;
    }
}
