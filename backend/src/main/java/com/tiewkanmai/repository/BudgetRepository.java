package com.tiewkanmai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tiewkanmai.model.Budget;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
}