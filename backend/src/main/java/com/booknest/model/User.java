package com.booknest.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

/**
 * Abstract Base Class: User
 * Demonstrates Abstraction and Inheritance for SE1020 OOP.
 * Encapsulates core customer/staff attributes.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "role",
    visible = true,
    defaultImpl = Customer.class
)
@JsonSubTypes({
    @JsonSubTypes.Type(value = Customer.class, name = "Customer"),
    @JsonSubTypes.Type(value = Admin.class, name = "Admin")
})
public abstract class User {
    // Encapsulation: All attributes are protected/private
    protected String id;
    protected String name;
    protected String email;
    protected String phone;
    protected String role;
    protected String status; // "Active", "Inactive"
    protected String address;
    protected String registeredDate;

    // Default constructor (required by Jackson serializer)
    public User() {
    }

    public User(String id, String name, String email, String phone, String role, String status, String address, String registeredDate) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.status = status;
        this.address = address;
        this.registeredDate = registeredDate;
    }

    // Polymorphic abstract methods to be overridden by subclasses
    @JsonIgnore
    public abstract String getRoleDescription();

    @JsonIgnore
    public abstract boolean canManageInventory();

    // Getters and Setters (Encapsulation)
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        if (name != null && !name.trim().isEmpty()) {
            this.name = name.trim();
        }
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getRegisteredDate() {
        return registeredDate;
    }

    public void setRegisteredDate(String registeredDate) {
        this.registeredDate = registeredDate;
    }
}
