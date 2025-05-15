package com.tiewkanmai.mapper;

import com.tiewkanmai.dto.response.PlanResponse;
import com.tiewkanmai.model.Plan;

public class PlanMapper {

    public static PlanResponse toDto(Plan plan) {
        PlanResponse response = new PlanResponse();
        response.setId(plan.getId());
        response.setName(plan.getName());
        response.setImg(plan.getImg());
        response.setNote(plan.getNote());
        response.setJsonData(plan.getJsonData());
        response.setFavAmount(plan.getFavAmount());
        response.setCreatedDate(plan.getCreatedDate());
        return response;
    }
}
