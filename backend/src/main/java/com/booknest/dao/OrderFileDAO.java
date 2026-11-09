package com.booknest.dao;

import com.booknest.model.Order;
import com.booknest.model.OrderItem;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * OrderFileDAO
 * Handles persistent CRUD operations for Customer Orders using text-file read/write (orders.txt).
 */
@Repository
public class OrderFileDAO implements GenericDAO<Order, String> {
    private final File dataFile;
    private final ObjectMapper objectMapper;

    public OrderFileDAO(@Value("${booknest.data.dir:./data}") String dataDir) {
        File dir = new File(dataDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        this.dataFile = new File(dir, "orders.txt");
        this.objectMapper = new ObjectMapper()
                .enable(SerializationFeature.INDENT_OUTPUT)
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        initFileWithSeedData();
    }

    private synchronized void initFileWithSeedData() {
        if (!dataFile.exists() || dataFile.length() == 0) {
            List<Order> initialOrders = createDefaultOrders();
            writeAll(initialOrders);
        }
    }

    private synchronized List<Order> readAll() {
        if (!dataFile.exists() || dataFile.length() == 0) {
            return new ArrayList<>();
        }
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(dataFile), StandardCharsets.UTF_8))) {
            return objectMapper.readValue(reader, new TypeReference<List<Order>>() {});
        } catch (IOException e) {
            System.err.println("Error reading orders.txt: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    private synchronized void writeAll(List<Order> orders) {
        try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(dataFile), StandardCharsets.UTF_8))) {
            objectMapper.writeValue(writer, orders);
        } catch (IOException e) {
            System.err.println("Error writing orders.txt: " + e.getMessage());
        }
    }

    @Override
    public List<Order> findAll() {
        return readAll();
    }

    @Override
    public Optional<Order> findById(String id) {
        return readAll().stream()
                .filter(o -> o.getId().equalsIgnoreCase(id))
                .findFirst();
    }

    @Override
    public synchronized Order save(Order order) {
        order.recalculateTotals();
        List<Order> orders = readAll();
        boolean updated = false;

        for (int i = 0; i < orders.size(); i++) {
            if (orders.get(i).getId().equalsIgnoreCase(order.getId())) {
                orders.set(i, order);
                updated = true;
                break;
            }
        }

        if (!updated) {
            if (order.getId() == null || order.getId().trim().isEmpty()) {
                order.setId("ORD-" + (System.currentTimeMillis() % 10000));
            }
            orders.add(order);
        }

        writeAll(orders);
        return order;
    }

    public synchronized boolean updateStatus(String id, String newStatus) {
        List<Order> orders = readAll();
        for (Order o : orders) {
            if (o.getId().equalsIgnoreCase(id)) {
                o.setStatus(newStatus);
                writeAll(orders);
                return true;
            }
        }
        return false;
    }

    @Override
    public synchronized boolean deleteById(String id) {
        List<Order> orders = readAll();
        boolean removed = orders.removeIf(o -> o.getId().equalsIgnoreCase(id));
        if (removed) {
            writeAll(orders);
        }
        return removed;
    }

    private List<Order> createDefaultOrders() {
        List<Order> list = new ArrayList<>();

        Order o1 = new Order("ORD-1001", "USR-1002", "Amaya Fernando", "amaya@gmail.com", "+94 71 987 6543", "2026-10-02", "45 Galle Road, Mount Lavinia");
        o1.setNotes("Please call before delivery.");
        List<OrderItem> items1 = new ArrayList<>();
        items1.add(new OrderItem("BK-1003", "Atomic Habits", 3750, 1, "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80"));
        items1.add(new OrderItem("BK-1001", "Harry Potter and the Philosopher's Stone", 2850, 1, "https://images.unsplash.com/photo-1618666012174-83b441c0bc76?auto=format&fit=crop&w=600&q=80"));
        o1.setItems(items1);
        o1.setShippingFee(350);
        o1.setStatus("Delivered");
        list.add(o1);

        Order o2 = new Order("ORD-1002", "USR-1003", "Dilshan Silva", "dilshan@yahoo.com", "+94 76 543 2109", "2026-10-05", "88 Kandy Road, Kiribathgoda");
        o2.setNotes("Leave package at reception if unavailable.");
        List<OrderItem> items2 = new ArrayList<>();
        items2.add(new OrderItem("BK-1005", "Clean Code: A Handbook of Agile Software Craftsmanship", 6400, 1, "https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=600&q=80"));
        o2.setItems(items2);
        o2.setShippingFee(350);
        o2.setStatus("Shipped");
        list.add(o2);

        return list;
    }
}
