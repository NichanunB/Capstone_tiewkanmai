package com.tiewkanmai.repository;

import com.tiewkanmai.model.Subdistrict;
import com.tiewkanmai.model.District;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubdistrictRepository extends JpaRepository<Subdistrict, Long> {
    List<Subdistrict> findByDistrict(District district);
    List<Subdistrict> findByDistrict_Id(Long districtId);
} 