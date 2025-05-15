package com.tiewkanmai.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tiewkanmai.model.Plan;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Long> {

    // ✅ ใช้ดึงแผนทั้งหมดของผู้ใช้
    @Query("SELECT p FROM Plan p JOIN p.users u WHERE u.id = :userId")
    List<Plan> findAllByUserId(@Param("userId") Long userId);

    // ✅ ใช้ดึงแผนเฉพาะ id + userId (ดีกว่า load แล้ว stream เช็คเอง)
    @Query("SELECT p FROM Plan p JOIN p.users u WHERE u.id = :userId AND p.id = :planId")
    Optional<Plan> findByIdAndUserId(@Param("planId") Long planId, @Param("userId") Long userId);

    // ✅ ใช้เช็คว่า user มีสิทธิ์ในแผนนี้ไหม (ใช้ก่อน delete ก็ได้)
    @Query("SELECT COUNT(p) > 0 FROM Plan p JOIN p.users u WHERE u.id = :userId AND p.id = :planId")
    boolean existsByIdAndUserId(@Param("planId") Long planId, @Param("userId") Long userId);
} 
