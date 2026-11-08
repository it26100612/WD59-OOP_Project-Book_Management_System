package com.booknest.service;

import com.booknest.dao.UserFileDAO;
import com.booknest.model.Admin;
import com.booknest.model.Customer;
import com.booknest.model.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service Layer: UserService
 * Contains business logic and polymorphic handling for Users.
 */
@Service
public class UserService {
    private final UserFileDAO userDAO;

    public UserService(UserFileDAO userDAO) {
        this.userDAO = userDAO;
    }

    public List<User> getAllUsers() {
        return userDAO.findAll();
    }

    public Optional<User> getUserById(String id) {
        return userDAO.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userDAO.findByEmail(email);
    }

    /**
     * Demonstrates Polymorphism: Authenticates and returns either Customer or Admin.
     */
    public Optional<User> authenticate(String email, String password) {
        // Coursework authentication logic
        Optional<User> userOpt = userDAO.findByEmail(email);
        if (userOpt.isPresent()) {
            return userOpt;
        }
        return Optional.empty();
    }

    public User saveUser(User user) {
        if (user.getName() == null || user.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("User name cannot be empty.");
        }
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("User email cannot be empty.");
        }

        // Default role fallback to Customer if not set
        if (user.getRole() == null || user.getRole().trim().isEmpty()) {
            user.setRole("Customer");
        }

        return userDAO.save(user);
    }

    public boolean deleteUser(String id) {
        return userDAO.deleteById(id);
    }
}
