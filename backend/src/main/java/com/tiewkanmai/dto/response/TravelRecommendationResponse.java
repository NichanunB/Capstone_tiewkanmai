package com.tiewkanmai.dto.response;

import java.math.BigDecimal;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;

public class TravelRecommendationResponse {
    
    private Integer days;
    private BigDecimal budget;
    private JsonNode itinerary;
    private Map<String, BigDecimal> budgetAllocation;

    // Getters and Setters
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

    public JsonNode getItinerary() {
        return itinerary;
    }

    public void setItinerary(JsonNode itinerary) {
        this.itinerary = itinerary;
    }

    public Map<String, BigDecimal> getBudgetAllocation() {
        return budgetAllocation;
    }

    public void setBudgetAllocation(Map<String, BigDecimal> budgetAllocation) {
        this.budgetAllocation = budgetAllocation;
    }
}