package com.booknest.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Entity: OrderItem
 * Encapsulates an individual book item within a customer order.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class OrderItem {
    private String bookId;
    private String title;
    private double price;
    private int quantity;
    private String cover;

    public OrderItem() {
    }

    public OrderItem(String bookId, String title, double price, int quantity, String cover) {
        this.bookId = bookId;
        this.title = title;
        this.price = price;
        this.quantity = quantity;
        this.cover = cover;
    }

    @JsonIgnore
    public double getSubtotal() {
        return this.price * this.quantity;
    }

    public String getBookId() {
        return bookId;
    }

    public void setBookId(String bookId) {
        this.bookId = bookId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = Math.max(0.0, price);
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = Math.max(1, quantity);
    }

    public String getCover() {
        return cover;
    }

    public void setCover(String cover) {
        this.cover = cover;
    }
}
