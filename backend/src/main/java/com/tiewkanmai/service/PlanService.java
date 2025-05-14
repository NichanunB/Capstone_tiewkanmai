package com.tiewkanmai.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tiewkanmai.dto.request.PlanGenerateRequest;
import com.tiewkanmai.dto.request.PlanSaveRequest;
import com.tiewkanmai.dto.response.PlanResponse;
import com.tiewkanmai.model.Budget;
import com.tiewkanmai.model.Category;
import com.tiewkanmai.model.Plan;
import com.tiewkanmai.model.Province;
import com.tiewkanmai.model.User;
import com.tiewkanmai.repository.BudgetRepository;
import com.tiewkanmai.repository.CategoryRepository;
import com.tiewkanmai.repository.PlanRepository;
import com.tiewkanmai.repository.ProvinceRepository;
import com.tiewkanmai.repository.UserRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PlanService {

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProvinceRepository provinceRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private TATService tatService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Generate a travel plan
     * 
     * @param request PlanGenerateRequest
     * @param userId  User ID
     * @return JsonNode containing the generated plan
     */
    public JsonNode generatePlan(PlanGenerateRequest request, Long userId) {
        try {
            // Get province
            Optional<Province> provinceOpt = provinceRepository.findById(request.getProvinceId());
            if (!provinceOpt.isPresent()) {
                return null;
            }
            Province province = provinceOpt.get();

            // Get categories
            List<Category> categories = request.getCategoryIds().stream()
                    .map(id -> categoryRepository.findById(id).orElse(null))
                    .filter(category -> category != null)
                    .collect(Collectors.toList());

            if (categories.isEmpty()) {
                return null;
            }

            // Prepare category names for TAT API
            List<String> categoryNames = categories.stream()
                    .map(Category::getName)
                    .collect(Collectors.toList());

            // Generate plan using TAT API
            JsonNode tatPlaces = tatService.getPlaces(province.getName(), String.join(",", categoryNames), null);
            
            // Create plan structure
            return createPlanStructure(tatPlaces, request.getDays(), request.getBudget(), province.getName());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Create a structured plan
     */
    private JsonNode createPlanStructure(JsonNode tatPlaces, int days, BigDecimal budget, String provinceName) {
        try {
            // Create root node for the plan
            ObjectMapper mapper = new ObjectMapper();
            
            // Create plan days with places
            JsonNode planNode = createDailyItinerary(tatPlaces, days, budget, provinceName);
            
            return planNode;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    
    /**
     * Create daily itinerary
     */
    private JsonNode createDailyItinerary(JsonNode tatPlaces, int days, BigDecimal budget, String provinceName) {
        try {
            // In real-world scenario, we would implement more sophisticated algorithm here
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readTree("{\"province\":\"" + provinceName + "\", \"days\":" + days + ", \"budget\":" + budget + ", \"message\":\"Plan generated successfully\"}");
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Save a travel plan
     * 
     * @param request PlanSaveRequest
     * @param userId  User ID
     * @return Saved Plan ID
     */
    public Long savePlan(PlanSaveRequest request, Long userId) {
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            if (!userOpt.isPresent()) {
                return null;
            }
            User user = userOpt.get();

            // Create new plan
            Plan plan = new Plan();
            plan.setName(request.getName());
            plan.setImg(request.getImg());
            plan.setCreatedDate(LocalDateTime.now());
            plan.setFavAmount(0);
            plan.setNote(request.getNote());
            plan.setJsonData(request.getJsonData());

            // Create budget
            Budget budget = new Budget();
            budget.setCategory("General");
            budget.setAmount(new BigDecimal("0"));
            budgetRepository.save(budget);

            plan.setBudget(budget);
            Plan savedPlan = planRepository.save(plan);

            // Add plan to user's plans
            user.getPlans().add(savedPlan);
            userRepository.save(user);

            return savedPlan.getId();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Get all plans for a user
     * 
     * @param userId User ID
     * @return List of PlanResponse
     */
    public List<PlanResponse> getUserPlans(Long userId) {
        List<Plan> plans = planRepository.findAllByUserId(userId);
        return plans.stream()
                .map(this::convertToPlanResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get plan by ID
     * 
     * @param planId Plan ID
     * @param userId User ID (for authorization)
     * @return PlanResponse
     */
    public PlanResponse getPlanById(Long planId, Long userId) {
        Optional<Plan> planOpt = planRepository.findById(planId);
        if (!planOpt.isPresent()) {
            return null;
        }

        Plan plan = planOpt.get();
        boolean hasAccess = plan.getUsers().stream()
                .anyMatch(user -> user.getId().equals(userId));

        if (!hasAccess) {
            return null;
        }

        return convertToPlanResponse(plan);
    }

    /**
     * Update plan
     * 
     * @param planId  Plan ID
     * @param request PlanSaveRequest
     * @param userId  User ID (for authorization)
     * @return Updated Plan ID
     */
    public Long updatePlan(Long planId, PlanSaveRequest request, Long userId) {
        Optional<Plan> planOpt = planRepository.findById(planId);
        if (!planOpt.isPresent()) {
            return null;
        }

        Plan plan = planOpt.get();
        boolean hasAccess = plan.getUsers().stream()
                .anyMatch(user -> user.getId().equals(userId));

        if (!hasAccess) {
            return null;
        }

        plan.setName(request.getName());
        if (request.getImg() != null) {
            plan.setImg(request.getImg());
        }
        if (request.getNote() != null) {
            plan.setNote(request.getNote());
        }
        plan.setJsonData(request.getJsonData());

        planRepository.save(plan);
        return plan.getId();
    }

    /**
     * Delete plan
     * 
     * @param planId Plan ID
     * @param userId User ID (for authorization)
     * @return true if deleted, false otherwise
     */
    public boolean deletePlan(Long planId, Long userId) {
        Optional<Plan> planOpt = planRepository.findById(planId);
        if (!planOpt.isPresent()) {
            return false;
        }

        Plan plan = planOpt.get();
        boolean hasAccess = plan.getUsers().stream()
                .anyMatch(user -> user.getId().equals(userId));

        if (!hasAccess) {
            return false;
        }

        // Remove plan from user's plans
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.getPlans().remove(plan);
            userRepository.save(user);
        }

        planRepository.deleteById(planId);
        return true;
    }

    /**
     * Convert Plan to PlanResponse
     * 
     * @param plan Plan object
     * @return PlanResponse
     */
    private PlanResponse convertToPlanResponse(Plan plan) {
        PlanResponse response = new PlanResponse();
        response.setId(plan.getId());
        response.setName(plan.getName());
        response.setImg(plan.getImg());
        response.setCreatedDate(plan.getCreatedDate());
        response.setFavAmount(plan.getFavAmount());
        response.setNote(plan.getNote());
        response.setJsonData(plan.getJsonData());
        return response;
    }
}