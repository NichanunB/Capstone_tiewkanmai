package com.tiewkanmai.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.tiewkanmai.model.Plan;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Long> {

    // ✅ ใช้ดึงแผนทั้งหมดของผู้ใช้
    @Query("SELECT p FROM Plan p JOIN p.users u WHERE u.id = ?1")
    List<Plan> findAllByUserId(Long userId);

    // ✅ ใช้ดึงแผนเฉพาะ id + userId (ดีกว่า load แล้ว stream เช็คเอง)
    @Query("SELECT p FROM Plan p JOIN p.users u WHERE p.id = ?1 AND u.id = ?2")
    Optional<Plan> findByIdAndUserId(Long planId, Long userId);

    // ✅ ใช้เช็คว่า user มีสิทธิ์ในแผนนี้ไหม (ใช้ก่อน delete ก็ได้)
    @Query("SELECT p FROM Plan p JOIN p.users u WHERE p.id = ?1 AND u.id = ?2")
    boolean existsByIdAndUserId(Long planId, Long userId);

    // ดึงแผนทั้งหมด (public)
    @Query("SELECT p FROM Plan p WHERE p.isPublic = true")
    List<Plan> findAllPublic();

    // เรียงตามยอดนิยม (จำนวน fav_amount มากสุด)
    @Query("SELECT p FROM Plan p WHERE p.isPublic = true ORDER BY p.favAmount DESC")
    List<Plan> findAllOrderByFavAmountDesc();

    // เรียงตามล่าสุด (created_date ใหม่สุด)
    @Query("SELECT p FROM Plan p WHERE p.isPublic = true ORDER BY p.createdDate DESC")
    List<Plan> findAllOrderByCreatedDateDesc();
} 
