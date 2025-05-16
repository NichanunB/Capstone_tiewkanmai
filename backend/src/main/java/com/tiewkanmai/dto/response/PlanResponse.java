package com.tiewkanmai.dto.response;

import java.time.LocalDateTime;

public class PlanResponse {
    private Long id;
    private String title;         // <-- ชื่อแผน (เดิมชื่อ name)
    private String coverImage;    // <-- รูปปก (เดิมชื่อ img)
    private LocalDateTime createdDate;
    private Integer favAmount;
    private String note;
    private String jsonData;      // <-- blocks (JSON)

    // --- getter/setter ทุก field ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }

    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }

    public Integer getFavAmount() { return favAmount; }
    public void setFavAmount(Integer favAmount) { this.favAmount = favAmount; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public String getJsonData() { return jsonData; }
    public void setJsonData(String jsonData) { this.jsonData = jsonData; }
}
