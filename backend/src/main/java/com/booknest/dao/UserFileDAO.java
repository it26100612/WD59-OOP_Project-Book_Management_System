package com.booknest.dao;

import com.booknest.model.Admin;
import com.booknest.model.Customer;
import com.booknest.model.User;
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
 * UserFileDAO
 * Handles persistent CRUD operations for Users (Customers and Admins)
 * using text-file read/write (users.txt).
 * Demonstrates Polymorphism: Stores polymorphic collections of User subclasses.
 */
@Repository
public class UserFileDAO implements GenericDAO<User, String> {
    private final File dataFile;
    private final ObjectMapper objectMapper;

    public UserFileDAO(@Value("${booknest.data.dir:./data}") String dataDir) {
        File dir = new File(dataDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        this.dataFile = new File(dir, "users.txt");
        this.objectMapper = new ObjectMapper()
                .enable(SerializationFeature.INDENT_OUTPUT)
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        initFileWithSeedData();
    }

    private synchronized void initFileWithSeedData() {
        if (!dataFile.exists() || dataFile.length() == 0) {
            List<User> initialUsers = createDefaultUsers();
            writeAll(initialUsers);
        }
    }

    private synchronized List<User> readAll() {
        if (!dataFile.exists() || dataFile.length() == 0) {
            return new ArrayList<>();
        }
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(dataFile), StandardCharsets.UTF_8))) {
            return objectMapper.readValue(reader, new TypeReference<List<User>>() {});
        } catch (IOException e) {
            System.err.println("Error reading users.txt: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    private synchronized void writeAll(List<User> users) {
        try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(dataFile), StandardCharsets.UTF_8))) {
            objectMapper.writeValue(writer, users);
        } catch (IOException e) {
            System.err.println("Error writing users.txt: " + e.getMessage());
        }
    }

    @Override
    public List<User> findAll() {
        return readAll();
    }

    @Override
    public Optional<User> findById(String id) {
        return readAll().stream()
                .filter(u -> u.getId().equalsIgnoreCase(id))
                .findFirst();
    }

    public Optional<User> findByEmail(String email) {
        if (email == null) return Optional.empty();
        return readAll().stream()
                .filter(u -> email.equalsIgnoreCase(u.getEmail()))
                .findFirst();
    }

    @Override
    public synchronized User save(User user) {
        List<User> users = readAll();
        boolean updated = false;

        for (int i = 0; i < users.size(); i++) {
            if (users.get(i).getId().equalsIgnoreCase(user.getId())) {
                users.set(i, user);
                updated = true;
                break;
            }
        }

        if (!updated) {
            if (user.getId() == null || user.getId().trim().isEmpty()) {
                user.setId("USR-" + (System.currentTimeMillis() % 10000));
            }
            users.add(user);
        }

        writeAll(users);
        return user;
    }

    @Override
    public synchronized boolean deleteById(String id) {
        List<User> users = readAll();
        boolean removed = users.removeIf(u -> u.getId().equalsIgnoreCase(id));
        if (removed) {
            writeAll(users);
        }
        return removed;
    }

    private List<User> createDefaultUsers() {
        List<User> list = new ArrayList<>();

        Admin admin = new Admin("USR-1001", "Kasun Perera", "admin@booknest.lk", "+94 77 123 4567", "Active", "12/3 Lotus Road, Colombo 03", "2026-01-15", 2);
        list.add(admin);

        Customer c1 = new Customer("USR-1002", "Amaya Fernando", "amaya@gmail.com", "+94 71 987 6543", "Active", "45 Galle Road, Mount Lavinia", "2026-02-10");
        list.add(c1);

        Customer c2 = new Customer("USR-1003", "Dilshan Silva", "dilshan@yahoo.com", "+94 76 543 2109", "Active", "88 Kandy Road, Kiribathgoda", "2026-03-01");
        list.add(c2);

        Customer c3 = new Customer("USR-1004", "Kavindi Senanayake", "kavindi@gmail.com", "+94 70 334 5566", "Active", "24 Peradeniya Road, Kandy", "2026-03-18");
        list.add(c3);

        Customer c4 = new Customer("USR-1005", "Nuwan Bandara", "nuwan@booknest.lk", "+94 78 889 9001", "Active", "105 Station Road, Nugegoda", "2026-02-28");
        list.add(c4);

        return list;
    }
}
