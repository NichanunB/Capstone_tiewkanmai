package com.tiewkanmai.dto.request;

import jakarta.validation.constraints.NotBlank;

public class PlanSaveRequest {
    @NotBlank
    private String name;
    
    private String jsonData;
    
    private String note;
    
    private String img;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getJsonData() {
        return jsonData;
    }

    public void setJsonData(String jsonData) {
        this.jsonData = jsonData;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }
}