package com.tiewkanmai.dto.request;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.NotBlank;

public class PlanSaveRequest {

    @NotBlank
    private String title;            // ชื่อแผน

    private JsonNode jsonData;       // เก็บข้อมูลบล็อกต่าง ๆ ในรูปแบบ JSON (Array/Object)

    private String note;             // หมายเหตุ

    private String coverImage;       // ภาพหน้าปก (Base64)

    private Boolean isPublic;

    private String status;

    // --- Getters & Setters ---
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public JsonNode getJsonData() {
        return jsonData;
    }

    public void setJsonData(JsonNode jsonData) {
        this.jsonData = jsonData;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getCoverImage() {
        return coverImage;
    }

    public void setCoverImage(String coverImage) {
        this.coverImage = coverImage;
    }

    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}