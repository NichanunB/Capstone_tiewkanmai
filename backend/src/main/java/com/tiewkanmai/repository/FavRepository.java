package com.tiewkanmai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tiewkanmai.model.Fav;

@Repository
public interface FavRepository extends JpaRepository<Fav, Long> {
}