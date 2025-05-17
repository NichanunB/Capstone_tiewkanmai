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
    private LongdoMapService longdoMapService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public JsonNode generatePlan(PlanGenerateRequest request, Long userId) {
        try {
            Optional<Province> provinceOpt = provinceRepository.findById(request.getProvinceId());
            if (!provinceOpt.isPresent()) return null;

            Province province = provinceOpt.get();

            List<Category> categories = request.getCategoryIds().stream()
                    .map(id -> categoryRepository.findById(id).orElse(null))
                    .filter(category -> category != null)
                    .collect(Collectors.toList());

            if (categories.isEmpty()) return null;

            List<String> categoryNames = categories.stream()
                    .map(Category::getName)
                    .collect(Collectors.toList());

            JsonNode planData = longdoMapService.generateTravelPlan(
                    province.getName(),
                    categoryNames,
                    request.getDays()
            );

            if (planData != null && planData.isObject()) {
                ((com.fasterxml.jackson.databind.node.ObjectNode) planData).put("budget", request.getBudget().toString());
            }

            return planData;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public Long savePlan(PlanSaveRequest request, Long userId) {
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            if (!userOpt.isPresent()) return null;

            User user = userOpt.get();

            Plan plan = new Plan();
            plan.setName(request.getTitle());
            plan.setImg(request.getCoverImage());
            plan.setCreatedDate(LocalDateTime.now());
            plan.setFavAmount(0);
            plan.setNote(request.getNote());

            // ✅ แปลง JsonNode → String
            plan.setJsonData(request.getJsonData().toString());

            Budget budget = new Budget();
            budget.setCategory("General");
            budget.setAmount(new BigDecimal("0"));
            budgetRepository.save(budget);

            plan.setBudget(budget);
            Plan savedPlan = planRepository.save(plan);

            user.getPlans().add(savedPlan);
            userRepository.save(user);

            return savedPlan.getId();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<PlanResponse> getUserPlans(Long userId) {
        List<Plan> plans = planRepository.findAllByUserId(userId);
        return plans.stream()
                .map(this::convertToPlanResponse)
                .collect(Collectors.toList());
    }

    public PlanResponse getPlanById(Long planId, Long userId) {
        Optional<Plan> planOpt = planRepository.findByIdAndUserId(planId, userId);
        if (!planOpt.isPresent()) return null;
        return convertToPlanResponse(planOpt.get());
    }

    public Long updatePlan(Long planId, PlanSaveRequest request, Long userId) {
        Optional<Plan> planOpt = planRepository.findByIdAndUserId(planId, userId);
        if (!planOpt.isPresent()) return null;

        Plan plan = planOpt.get();
        plan.setName(request.getTitle());
        if (request.getCoverImage() != null) plan.setImg(request.getCoverImage());
        if (request.getNote() != null) plan.setNote(request.getNote());

        // ✅ แปลง JsonNode → String
        plan.setJsonData(request.getJsonData().toString());

        planRepository.save(plan);
        return plan.getId();
    }

    public boolean deletePlan(Long planId, Long userId) {
        if (!planRepository.existsByIdAndUserId(planId, userId)) return false;

        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Plan> planOpt = planRepository.findById(planId);
        if (userOpt.isPresent() && planOpt.isPresent()) {
            User user = userOpt.get();
            Plan plan = planOpt.get();
            user.getPlans().remove(plan);
            userRepository.save(user);
            planRepository.delete(plan);
            return true;
        }

        return false;
    }

    public List<PlanResponse> getAllPlansPublic(String sort) {
        List<Plan> plans;
        if ("popular".equalsIgnoreCase(sort)) {
            plans = planRepository.findAllOrderByFavAmountDesc();
        } else if ("latest".equalsIgnoreCase(sort)) {
            plans = planRepository.findAllOrderByCreatedDateDesc();
        } else {
            plans = planRepository.findAllPublic();
        }
        return plans.stream().map(this::convertToPlanResponse).collect(Collectors.toList());
    }

    private PlanResponse convertToPlanResponse(Plan plan) {
        PlanResponse response = new PlanResponse();
        response.setId(plan.getId());
        response.setTitle(plan.getName());
        response.setCoverImage(plan.getImg());
        response.setCreatedDate(plan.getCreatedDate());
        response.setFavAmount(plan.getFavAmount());
        response.setNote(plan.getNote());
        response.setJsonData(plan.getJsonData());
        return response;
    }
}
