package com.booknest.model;

/**
 * Entity: Review
 * Encapsulates book ratings and customer commentary.
 */
public class Review {
    private String id;
    private String bookId;
    private String bookTitle;
    private String customerName;
    private int rating; // 1 to 5 stars
    private String comment;
    private String date;

    public Review() {
        this.rating = 5;
    }

    public Review(String id, String bookId, String bookTitle, String customerName, int rating, String comment, String date) {
        this.id = id;
        this.bookId = bookId;
        this.bookTitle = bookTitle;
        this.customerName = customerName;
        this.setRating(rating);
        this.comment = comment;
        this.date = date;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getBookId() {
        return bookId;
    }

    public void setBookId(String bookId) {
        this.bookId = bookId;
    }

    public String getBookTitle() {
        return bookTitle;
    }

    public void setBookTitle(String bookTitle) {
        this.bookTitle = bookTitle;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = Math.max(1, Math.min(5, rating));
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}
