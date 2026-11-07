package com.booknest.model;

/**
 * Subclass: Customer
 * Inherits from User, demonstrating Inheritance & Polymorphic method overriding.
 */
public class Customer extends User {
    private int loyaltyPoints;

    public Customer() {
        super();
        this.role = "Customer";
        this.loyaltyPoints = 0;
    }

    public Customer(String id, String name, String email, String phone, String status, String address, String registeredDate) {
        super(id, name, email, phone, "Customer", status, address, registeredDate);
        this.loyaltyPoints = 0;
    }

    // Polymorphism: Overriding abstract methods from User
    @Override
    public String getRoleDescription() {
        return "Storefront Customer with book browsing, purchasing, and review privileges.";
    }

    @Override
    public boolean canManageInventory() {
        return false;
    }

    public int getLoyaltyPoints() {
        return loyaltyPoints;
    }

    public void setLoyaltyPoints(int loyaltyPoints) {
        this.loyaltyPoints = Math.max(0, loyaltyPoints);
    }
}
