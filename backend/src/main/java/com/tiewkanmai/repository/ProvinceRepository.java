package com.tiewkanmai.repository;

import com.tiewkanmai.model.Province;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProvinceRepository extends JpaRepository<Province, Long> {
    Optional<Province> findFirstByName(String name);

    @Query("SELECT p FROM Province p JOIN p.regions r WHERE r.id = :regionId")
    List<Province> findAllByRegionId(@Param("regionId") Long regionId);
}
