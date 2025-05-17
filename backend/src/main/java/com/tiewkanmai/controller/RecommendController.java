package com.tiewkanmai.controller;

import com.tiewkanmai.dto.request.RecommendRequest;
import com.tiewkanmai.dto.response.RecommendResponse;
import com.tiewkanmai.external.RecommendClient;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recommend")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class RecommendController {


@Autowired
private RecommendClient recommendClient;

@PostMapping
public RecommendResponse[] getRecommendations(@RequestBody RecommendRequest request) {
    return recommendClient.getRecommendations(request);
}
}