package com.tiewkanmai.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tiewkanmai.model.Plan;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Long> {
    @Query("SELECT p FROM Plan p JOIN p.users u WHERE u.id = :userId")
    List<Plan> findAllByUserId(@Param("userId") Long userId);
}