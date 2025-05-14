package com.tiewkanmai.dto.request;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class PlanGenerateRequest {
    @NotNull
    private Long provinceId;
    
    private List<Long> categoryIds;
    
    @NotNull
    @Min(value = 1, message = "จำนวนวันต้องมากกว่าหรือเท่ากับ 1")
    private Integer days;
    
    @NotNull
    @Min(value = 0, message = "งบประมาณต้องมากกว่าหรือเท่ากับ 0")
    private BigDecimal budget;

    public Long getProvinceId() {
        return provinceId;
    }

    public void setProvinceId(Long provinceId) {
        this.provinceId = provinceId;
    }

    public List<Long> getCategoryIds() {
        return categoryIds;
    }

    public void setCategoryIds(List<Long> categoryIds) {
        this.categoryIds = categoryIds;
    }

    public Integer getDays() {
        return days;
    }

    public void setDays(Integer days) {
        this.days = days;
    }

    public BigDecimal getBudget() {
        return budget;
    }

    public void setBudget(BigDecimal budget) {
        this.budget = budget;
    }
}