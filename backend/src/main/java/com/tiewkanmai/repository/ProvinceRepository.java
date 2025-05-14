package com.tiewkanmai.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tiewkanmai.model.Province;

@Repository
public interface ProvinceRepository extends JpaRepository<Province, Long> {
    Province findByName(String name);
    
    @Query("SELECT p FROM Province p JOIN p.regions r WHERE r.id = :regionId")
    List<Province> findAllByRegionId(@Param("regionId") Long regionId);
}