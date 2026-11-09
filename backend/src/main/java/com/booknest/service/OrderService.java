package com.booknest.service;

import com.booknest.dao.BookFileDAO;
import com.booknest.dao.OrderFileDAO;
import com.booknest.model.Book;
import com.booknest.model.Order;
import com.booknest.model.OrderItem;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service Layer: OrderService
 * Coordinates order placement, inventory reduction, and status lifecycle.
 */
@Service
public class OrderService {
    private final OrderFileDAO orderDAO;
    private final BookFileDAO bookDAO;

    public OrderService(OrderFileDAO orderDAO, BookFileDAO bookDAO) {
        this.orderDAO = orderDAO;
        this.bookDAO = bookDAO;
    }

    public List<Order> getAllOrders() {
        return orderDAO.findAll();
    }

    public Optional<Order> getOrderById(String id) {
        return orderDAO.findById(id);
    }

    public List<Order> getOrdersByCustomerId(String customerId) {
        if (customerId == null) return getAllOrders();
        return orderDAO.findAll().stream()
                .filter(o -> customerId.equalsIgnoreCase(o.getCustomerId()))
                .collect(Collectors.toList());
    }

    public Order createOrder(Order order) {
        if (order.getItems() == null || order.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cannot place an order with an empty cart.");
        }

        // Reduce inventory stock for ordered books (Encapsulation business method)
        for (OrderItem item : order.getItems()) {
            Optional<Book> bookOpt = bookDAO.findById(item.getBookId());
            if (bookOpt.isPresent()) {
                Book book = bookOpt.get();
                book.reduceStock(item.getQuantity());
                bookDAO.save(book);
            }
        }

        order.recalculateTotals();
        return orderDAO.save(order);
    }

    public boolean updateOrderStatus(String orderId, String newStatus) {
        return orderDAO.updateStatus(orderId, newStatus);
    }

    public boolean deleteOrder(String id) {
        return orderDAO.deleteById(id);
    }
}
