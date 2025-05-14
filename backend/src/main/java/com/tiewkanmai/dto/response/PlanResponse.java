package com.tiewkanmai.dto.response;

import java.time.LocalDateTime;

public class PlanResponse {
    private Long id;
    private String name;
    private String img;
    private LocalDateTime createdDate;
    private Integer favAmount;
    private String note;
    private String jsonData;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public Integer getFavAmount() {
        return favAmount;
    }

    public void setFavAmount(Integer favAmount) {
        this.favAmount = favAmount;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getJsonData() {
        return jsonData;
    }

    public void setJsonData(String jsonData) {
        this.jsonData = jsonData;
    }
}