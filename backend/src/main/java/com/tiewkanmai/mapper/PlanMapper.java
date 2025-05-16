package com.tiewkanmai.mapper;

import com.tiewkanmai.dto.response.PlanResponse;
import com.tiewkanmai.model.Plan;

public class PlanMapper {
    public static PlanResponse toDto(Plan plan) {
        PlanResponse response = new PlanResponse();
        response.setId(plan.getId());
        response.setTitle(plan.getName());           // Entity.name → DTO.title
        response.setCoverImage(plan.getImg());       // Entity.img → DTO.coverImage
        response.setNote(plan.getNote());
        response.setJsonData(plan.getJsonData());
        response.setFavAmount(plan.getFavAmount());
        response.setCreatedDate(plan.getCreatedDate());
        return response;
    }
}
