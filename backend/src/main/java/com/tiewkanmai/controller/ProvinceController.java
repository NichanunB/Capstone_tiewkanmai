package com.tiewkanmai.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tiewkanmai.model.Province;
import com.tiewkanmai.repository.ProvinceRepository;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/provinces")
public class ProvinceController {
    @Autowired
    ProvinceRepository provinceRepository;

    @GetMapping
    public ResponseEntity<?> getAllProvinces(@RequestParam(required = false) Long region) {
        List<Province> provinces;
        
        if (region != null) {
            provinces = provinceRepository.findAllByRegionId(region);
        } else {
            provinces = provinceRepository.findAll();
        }
        
        return ResponseEntity.ok(provinces);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProvinceById(@PathVariable Long id) {
        return provinceRepository.findById(id)
                .map(province -> ResponseEntity.ok().body(province))
                .orElse(ResponseEntity.notFound().build());
    }
}