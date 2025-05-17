package com.tiewkanmai.model;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "plan")
public class Plan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "plan_id")
    private Long id;

    @Column(name = "plan_name")
    private String name;
    
    @Column(columnDefinition = "LONGTEXT")
    private String img;
    
    @Column(name = "created_date")
    private LocalDateTime createdDate;
    
    @Column(name = "updated_date")
    private LocalDateTime updatedDate;
    
    @Column(name = "fav_amount")
    private Integer favAmount;
    
    @Column(columnDefinition = "TEXT")
    private String note;
    
    @Column(name = "is_public")
    private Boolean isPublic = true;
    
    @Column(name = "status")
    private String status = "active";
    
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "budget_id", referencedColumnName = "budget_id")
    private Budget budget;

    @ManyToMany(mappedBy = "plans")
    @JsonIgnore
    private Set<User> users = new HashSet<>();
    
    // JSON data for detailed plan information
    @Column(columnDefinition = "LONGTEXT")
    private String jsonData;

    // Constructors
    public Plan() {
    }

    public Plan(String name, String img) {
        this.name = name;
        this.img = img;
        this.createdDate = LocalDateTime.now();
        this.updatedDate = LocalDateTime.now();
        this.favAmount = 0;
        this.isPublic = true;
        this.status = "active";
    }

    // Getters and Setters
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

    public LocalDateTime getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(LocalDateTime updatedDate) {
        this.updatedDate = updatedDate;
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

    public Budget getBudget() {
        return budget;
    }

    public void setBudget(Budget budget) {
        this.budget = budget;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }
    
    public String getJsonData() {
        return jsonData;
    }
    
    public void setJsonData(String jsonData) {
        this.jsonData = jsonData;
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