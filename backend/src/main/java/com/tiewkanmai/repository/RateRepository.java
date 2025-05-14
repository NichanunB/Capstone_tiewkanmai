package com.tiewkanmai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tiewkanmai.model.Rate;

@Repository
public interface RateRepository extends JpaRepository<Rate, Long> {
}