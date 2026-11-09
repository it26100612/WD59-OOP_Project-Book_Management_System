package com.booknest.model;

/**
 * Subclass: Admin
 * Inherits from User, demonstrating Inheritance & Polymorphic method overriding.
 */
public class Admin extends User {
    private int privilegeLevel; // 1 = Standard Admin, 2 = Super Admin

    public Admin() {
        super();
        this.role = "Admin";
        this.privilegeLevel = 1;
    }

    public Admin(String id, String name, String email, String phone, String status, String address, String registeredDate, int privilegeLevel) {
        super(id, name, email, phone, "Admin", status, address, registeredDate);
        this.privilegeLevel = privilegeLevel;
    }

    // Polymorphism: Overriding abstract methods from User
    @Override
    public String getRoleDescription() {
        return "Store Administrator with full CRUD management and reporting privileges.";
    }

    @Override
    public boolean canManageInventory() {
        return true;
    }

    public int getPrivilegeLevel() {
        return privilegeLevel;
    }

    public void setPrivilegeLevel(int privilegeLevel) {
        this.privilegeLevel = privilegeLevel;
    }
}
