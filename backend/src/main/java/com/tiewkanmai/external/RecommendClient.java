package com.tiewkanmai.external;

import com.tiewkanmai.dto.request.RecommendRequest;
import com.tiewkanmai.dto.response.RecommendResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

@Component
public class RecommendClient {

public RecommendResponse[] getRecommendations(RecommendRequest request) {
    String url = "http://localhost:8000/recommend/"; // ✅ URL ไปยัง FastAPI

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);

    HttpEntity<RecommendRequest> entity = new HttpEntity<>(request, headers);

    RestTemplate restTemplate = new RestTemplate();
    ResponseEntity<RecommendResponse[]> response = restTemplate.postForEntity(
            url, entity, RecommendResponse[].class);

    return response.getBody();
}
}

