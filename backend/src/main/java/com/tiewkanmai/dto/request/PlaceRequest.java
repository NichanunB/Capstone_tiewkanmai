package com.tiewkanmai.dto.request;

public class PlaceRequest {
    private String name;
    private String nameEn;
    private String img;
    private String description;
    private String district;
    private String subdistrict;
    private Long categoryId;
    private String subCategory;
    private String map;
    private Double latitude;
    private Double longitude;
    private Long provinceId;

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getNameEn() { return nameEn; }
    public void setNameEn(String nameEn) { this.nameEn = nameEn; }
    public String getImg() { return img; }
    public void setImg(String img) { this.img = img; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    public String getSubdistrict() { return subdistrict; }
    public void setSubdistrict(String subdistrict) { this.subdistrict = subdistrict; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public String getSubCategory() { return subCategory; }
    public void setSubCategory(String subCategory) { this.subCategory = subCategory; }
    public String getMap() { return map; }
    public void setMap(String map) { this.map = map; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public Long getProvinceId() { return provinceId; }
    public void setProvinceId(Long provinceId) { this.provinceId = provinceId; }
} 