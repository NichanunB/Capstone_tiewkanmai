package com.tiewkanmai.model;

import jakarta.persistence.*;

@Entity
@Table(name = "subdistrict")
public class Subdistrict {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "subdistrict_id")
    private Long id;

    @Column(name = "subdistrict_name")
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "district_id")
    private District district;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public District getDistrict() { return district; }
    public void setDistrict(District district) { this.district = district; }
} 