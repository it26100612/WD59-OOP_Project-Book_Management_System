package com.booknest.dao;

import com.booknest.model.Review;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * ReviewFileDAO
 * Handles persistent CRUD operations for Customer Book Reviews using text-file read/write (reviews.txt).
 */
@Repository
public class ReviewFileDAO implements GenericDAO<Review, String> {
    private final File dataFile;
    private final ObjectMapper objectMapper;

    public ReviewFileDAO(@Value("${booknest.data.dir:./data}") String dataDir) {
        File dir = new File(dataDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        this.dataFile = new File(dir, "reviews.txt");
        this.objectMapper = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);
        initFileWithSeedData();
    }

    private synchronized void initFileWithSeedData() {
        if (!dataFile.exists() || dataFile.length() == 0) {
            List<Review> initialReviews = createDefaultReviews();
            writeAll(initialReviews);
        }
    }

    private synchronized List<Review> readAll() {
        if (!dataFile.exists() || dataFile.length() == 0) {
            return new ArrayList<>();
        }
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(dataFile), StandardCharsets.UTF_8))) {
            return objectMapper.readValue(reader, new TypeReference<List<Review>>() {});
        } catch (IOException e) {
            System.err.println("Error reading reviews.txt: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    private synchronized void writeAll(List<Review> reviews) {
        try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(dataFile), StandardCharsets.UTF_8))) {
            objectMapper.writeValue(writer, reviews);
        } catch (IOException e) {
            System.err.println("Error writing reviews.txt: " + e.getMessage());
        }
    }

    @Override
    public List<Review> findAll() {
        return readAll();
    }

    @Override
    public Optional<Review> findById(String id) {
        return readAll().stream()
                .filter(r -> r.getId().equalsIgnoreCase(id))
                .findFirst();
    }

    public List<Review> findByBookId(String bookId) {
        if (bookId == null) return new ArrayList<>();
        return readAll().stream()
                .filter(r -> bookId.equalsIgnoreCase(r.getBookId()))
                .collect(Collectors.toList());
    }

    @Override
    public synchronized Review save(Review review) {
        List<Review> reviews = readAll();
        boolean updated = false;

        for (int i = 0; i < reviews.size(); i++) {
            if (reviews.get(i).getId().equalsIgnoreCase(review.getId())) {
                reviews.set(i, review);
                updated = true;
                break;
            }
        }

        if (!updated) {
            if (review.getId() == null || review.getId().trim().isEmpty()) {
                review.setId("REV-" + (System.currentTimeMillis() % 10000));
            }
            reviews.add(review);
        }

        writeAll(reviews);
        return review;
    }

    @Override
    public synchronized boolean deleteById(String id) {
        List<Review> reviews = readAll();
        boolean removed = reviews.removeIf(r -> r.getId().equalsIgnoreCase(id));
        if (removed) {
            writeAll(reviews);
        }
        return removed;
    }

    private List<Review> createDefaultReviews() {
        List<Review> list = new ArrayList<>();
        list.add(new Review("REV-1001", "BK-1003", "Atomic Habits", "Amaya Fernando", 5, "A truly life-changing read! The practical step-by-step guidance on habit stacking works wonders.", "2026-10-03"));
        list.add(new Review("REV-1002", "BK-1005", "Clean Code", "Dilshan Silva", 5, "Essential reading for every software engineering student.", "2026-10-06"));
        list.add(new Review("REV-1003", "BK-1001", "Harry Potter and the Philosopher's Stone", "Kavindi Senanayake", 5, "Timeless classic! The book arrived in pristine condition.", "2026-10-04"));
        list.add(new Review("REV-1004", "BK-1004", "Rich Dad Poor Dad", "Nuwan Bandara", 4, "Very insightful perspective on financial literacy and assets.", "2026-10-01"));
        list.add(new Review("REV-1005", "BK-1008", "Sapiens: A Brief History of Humankind", "Amaya Fernando", 5, "Mind-expanding exploration of human civilization.", "2026-10-08"));
        return list;
    }
}
