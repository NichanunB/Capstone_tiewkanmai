package com.tiewkanmai.mapper;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tiewkanmai.dto.response.PlanResponse;
import com.tiewkanmai.model.Plan;

public class PlanMapper {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static PlanResponse toDto(Plan plan) {
        PlanResponse response = new PlanResponse();
        response.setId(plan.getId());
        response.setTitle(plan.getName());           // Entity.name → DTO.title
        response.setCoverImage(plan.getImg());       // Entity.img → DTO.coverImage
        response.setCreatedDate(plan.getCreatedDate());
        response.setUpdatedDate(plan.getUpdatedDate());
        response.setFavAmount(plan.getFavAmount());
        response.setNote(plan.getNote());
        response.setIsPublic(plan.getIsPublic());
        response.setStatus(plan.getStatus());
        
        // Convert jsonData from String to JsonNode
        if (plan.getJsonData() != null) {
            try {
                JsonNode jsonData = objectMapper.readTree(plan.getJsonData());
                response.setJsonData(jsonData);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        
        return response;
    }
}
