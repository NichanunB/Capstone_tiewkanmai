package com.tiewkanmai.model;

import jakarta.persistence.*;

@Entity
@Table(name = "fav")
public class Fav {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fav_id")
    private Long id;

    @Column(name = "fav_amount")
    private Integer amount;

    // Constructors
    public Fav() {
    }

    public Fav(Integer amount) {
        this.amount = amount;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getAmount() {
        return amount;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }
}