package com.tiewkanmai.dto.request;

import jakarta.validation.constraints.NotBlank;

public class PlanSaveRequest {
    @NotBlank
    private String title;            // เดิมชื่อ 'name'
    
    private String jsonData;         // เก็บ blocks JSON.stringify(...)
    private String note;
    
    private String coverImage;       // เดิมชื่อ 'img'

    // --- getters & setters ---
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getJsonData() { return jsonData; }
    public void setJsonData(String jsonData) { this.jsonData = jsonData; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }
}
