package com.tiewkanmai.controller;

import com.tiewkanmai.service.AttractionImporterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dev")
public class DevController {

    @Autowired
    private AttractionImporterService importerService;

    @PostMapping("/import-places")
    public ResponseEntity<?> importPlaces() {
        importerService.importFromAttractions();
        return ResponseEntity.ok("Import completed with images from Longdo!");
    }
}
