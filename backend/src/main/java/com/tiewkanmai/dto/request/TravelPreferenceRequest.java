package com.tiewkanmai.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

public class TravelPreferenceRequest {
    
    private List<String> preferences;
    
    @NotNull(message = "งบประมาณต้องไม่เป็นค่าว่าง")
    @Min(value = 0, message = "งบประมาณต้องมากกว่าหรือเท่ากับ 0")
    private BigDecimal budget;
    
    @NotNull(message = "จำนวนวันต้องไม่เป็นค่าว่าง")
    @Min(value = 1, message = "จำนวนวันต้องมากกว่าหรือเท่ากับ 1")
    private Integer days;
    
    private List<Long> selectedProvinces;

    // Getters and Setters
    public List<String> getPreferences() {
        return preferences;
    }

    public void setPreferences(List<String> preferences) {
        this.preferences = preferences;
    }

    public BigDecimal getBudget() {
        return budget;
    }

    public void setBudget(BigDecimal budget) {
        this.budget = budget;
    }

    public Integer getDays() {
        return days;
    }

    public void setDays(Integer days) {
        this.days = days;
    }

    public List<Long> getSelectedProvinces() {
        return selectedProvinces;
    }

    public void setSelectedProvinces(List<Long> selectedProvinces) {
        this.selectedProvinces = selectedProvinces;
    }
}