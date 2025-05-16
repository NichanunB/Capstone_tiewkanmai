package com.tiewkanmai.repository;

import com.tiewkanmai.model.District;
import com.tiewkanmai.model.Province;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DistrictRepository extends JpaRepository<District, Long> {
    List<District> findByProvince(Province province);
    List<District> findByProvince_Id(Long provinceId);
} 