package com.tiewkanmai.dto.response;

import java.time.LocalDateTime;

import com.fasterxml.jackson.databind.JsonNode;

public class PlanResponse {
    private Long id;
    private String title;         // <-- ชื่อแผน (เดิมชื่อ name)
    private String coverImage;    // <-- รูปปก (เดิมชื่อ img)
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private Integer favAmount;
    private String note;
    private Boolean isPublic;
    private String status;
    private JsonNode jsonData;      // <-- blocks (JSON)

    // --- getter/setter ทุก field ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }

    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }

    public LocalDateTime getUpdatedDate() { return updatedDate; }
    public void setUpdatedDate(LocalDateTime updatedDate) { this.updatedDate = updatedDate; }

    public Integer getFavAmount() { return favAmount; }
    public void setFavAmount(Integer favAmount) { this.favAmount = favAmount; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public Boolean getIsPublic() { return isPublic; }
    public void setIsPublic(Boolean isPublic) { this.isPublic = isPublic; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public JsonNode getJsonData() { return jsonData; }
    public void setJsonData(JsonNode jsonData) { this.jsonData = jsonData; }
}
