package com.tiewkanmai.dto.request;

public class CreatePlanRequest {
    private String title;
    private Integer budget;
    private String notes;

    // Constructors
    public CreatePlanRequest() {}

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getBudget() {
        return budget;
    }

    public void setBudget(Integer budget) {
        this.budget = budget;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
