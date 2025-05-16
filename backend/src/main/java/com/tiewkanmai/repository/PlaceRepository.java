package com.tiewkanmai.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tiewkanmai.model.Place;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {
    @Query("SELECT p FROM Place p JOIN p.provinces pr WHERE pr.id = :provinceId")
    List<Place> findAllByProvinceId(@Param("provinceId") Long provinceId);
    
    @Query("SELECT p FROM Place p JOIN p.category c WHERE c.id = :categoryId")
    List<Place> findAllByCategoryId(@Param("categoryId") Long categoryId);
    
    @Query("SELECT p FROM Place p JOIN p.provinces pr JOIN p.category c WHERE pr.id = :provinceId AND c.id = :categoryId")
    List<Place> findAllByProvinceIdAndCategoryId(@Param("provinceId") Long provinceId, @Param("categoryId") Long categoryId);
    
    // Find places by distance (would require implementation with native query or specialized JPA extension)
    // Using dummy method for now
    @Query("SELECT p FROM Place p WHERE p.latitude IS NOT NULL AND p.longitude IS NOT NULL")
    List<Place> findNearby(@Param("lat") Double latitude, @Param("lng") Double longitude, @Param("radius") Integer radiusKm);

    @Query("SELECT p FROM Place p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Place> searchByName(@Param("keyword") String keyword);
}