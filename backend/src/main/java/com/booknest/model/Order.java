package com.booknest.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity: Order
 * Encapsulates complete checkout and lifecycle information for customer purchases.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class Order {
    private String id;
    private String customerId;
    private String customerName;
    private String email;
    private String phone;
    private String date;
    private String deliveryAddress;
    private String notes;
    private List<OrderItem> items;
    private double subtotal;
    private double shippingFee;
    private double total;
    private String status; // Pending, Processing, Shipped, Delivered, Cancelled

    public Order() {
        this.items = new ArrayList<>();
        this.shippingFee = 350.0;
        this.status = "Pending";
    }

    public Order(String id, String customerId, String customerName, String email, String phone, String date, String deliveryAddress) {
        this();
        this.id = id;
        this.customerId = customerId;
        this.customerName = customerName;
        this.email = email;
        this.phone = phone;
        this.date = date;
        this.deliveryAddress = deliveryAddress;
    }

    // Business Method: recalculates subtotal and total from line items
    public void recalculateTotals() {
        double sum = 0.0;
        if (items != null) {
            for (OrderItem item : items) {
                sum += item.getSubtotal();
            }
        }
        this.subtotal = sum;
        this.total = this.subtotal + this.shippingFee;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
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

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items != null ? items : new ArrayList<>();
        recalculateTotals();
    }

    public double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(double subtotal) {
        this.subtotal = subtotal;
    }

    public double getShippingFee() {
        return shippingFee;
    }

    public void setShippingFee(double shippingFee) {
        this.shippingFee = shippingFee;
        this.total = this.subtotal + this.shippingFee;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
