package com.booknest.service;

import com.booknest.dao.CategoryFileDAO;
import com.booknest.model.Category;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service Layer: CategoryService
 * Contains business logic for book categories.
 */
@Service
public class CategoryService {
    private final CategoryFileDAO categoryDAO;

    public CategoryService(CategoryFileDAO categoryDAO) {
        this.categoryDAO = categoryDAO;
    }

    public List<Category> getAllCategories() {
        return categoryDAO.findAll();
    }

    public Optional<Category> getCategoryById(String id) {
        return categoryDAO.findById(id);
    }

    public Category saveCategory(Category category) {
        if (category.getName() == null || category.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Category name cannot be empty.");
        }
        return categoryDAO.save(category);
    }

    public boolean deleteCategory(String id) {
        return categoryDAO.deleteById(id);
    }
}
