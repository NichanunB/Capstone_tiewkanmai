package com.tiewkanmai.dto.response;

public class RecommendResponse {
private Long place_id;
private String name;
private String category;
private Double adjusted_score;


public RecommendResponse() {
}

public RecommendResponse(Long place_id, String name, String category, Double adjusted_score) {
    this.place_id = place_id;
    this.name = name;
    this.category = category;
    this.adjusted_score = adjusted_score;
}

public Long getPlace_id() {
    return place_id;
}

public void setPlace_id(Long place_id) {
    this.place_id = place_id;
}

public String getName() {
    return name;
}

public void setName(String name) {
    this.name = name;
}

public String getCategory() {
    return category;
}

public void setCategory(String category) {
    this.category = category;
}

public Double getAdjusted_score() {
    return adjusted_score;
}

public void setAdjusted_score(Double adjusted_score) {
    this.adjusted_score = adjusted_score;
}
}