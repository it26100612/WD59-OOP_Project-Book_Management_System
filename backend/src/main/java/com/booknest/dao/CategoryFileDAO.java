package com.booknest.dao;

import com.booknest.model.Category;
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

/**
 * CategoryFileDAO
 * Handles persistent CRUD operations for Book Categories using text-file read/write (categories.txt).
 */
@Repository
public class CategoryFileDAO implements GenericDAO<Category, String> {
    private final File dataFile;
    private final ObjectMapper objectMapper;

    public CategoryFileDAO(@Value("${booknest.data.dir:./data}") String dataDir) {
        File dir = new File(dataDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        this.dataFile = new File(dir, "categories.txt");
        this.objectMapper = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);
        initFileWithSeedData();
    }

    private synchronized void initFileWithSeedData() {
        if (!dataFile.exists() || dataFile.length() == 0) {
            List<Category> initialCategories = createDefaultCategories();
            writeAll(initialCategories);
        }
    }

    private synchronized List<Category> readAll() {
        if (!dataFile.exists() || dataFile.length() == 0) {
            return new ArrayList<>();
        }
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(dataFile), StandardCharsets.UTF_8))) {
            return objectMapper.readValue(reader, new TypeReference<List<Category>>() {});
        } catch (IOException e) {
            System.err.println("Error reading categories.txt: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    private synchronized void writeAll(List<Category> categories) {
        try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(dataFile), StandardCharsets.UTF_8))) {
            objectMapper.writeValue(writer, categories);
        } catch (IOException e) {
            System.err.println("Error writing categories.txt: " + e.getMessage());
        }
    }

    @Override
    public List<Category> findAll() {
        return readAll();
    }

    @Override
    public Optional<Category> findById(String id) {
        return readAll().stream()
                .filter(c -> c.getId().equalsIgnoreCase(id))
                .findFirst();
    }

    @Override
    public synchronized Category save(Category category) {
        List<Category> categories = readAll();
        boolean updated = false;

        for (int i = 0; i < categories.size(); i++) {
            if (categories.get(i).getId().equalsIgnoreCase(category.getId())) {
                categories.set(i, category);
                updated = true;
                break;
            }
        }

        if (!updated) {
            if (category.getId() == null || category.getId().trim().isEmpty()) {
                category.setId("CAT-" + (categories.size() + 1));
            }
            categories.add(category);
        }

        writeAll(categories);
        return category;
    }

    @Override
    public synchronized boolean deleteById(String id) {
        List<Category> categories = readAll();
        boolean removed = categories.removeIf(c -> c.getId().equalsIgnoreCase(id));
        if (removed) {
            writeAll(categories);
        }
        return removed;
    }

    private List<Category> createDefaultCategories() {
        List<Category> list = new ArrayList<>();
        list.add(new Category("CAT-1", "Fiction", "Novels, fantasy, literature, and classic storytelling.", "bi-book"));
        list.add(new Category("CAT-2", "Science", "Physics, biology, space exploration, and scientific discovery.", "bi-lightbulb"));
        list.add(new Category("CAT-3", "Technology", "Software engineering, programming languages, and computing.", "bi-laptop"));
        list.add(new Category("CAT-4", "Education", "Academic textbooks, algorithms, mathematics, and student guides.", "bi-mortarboard"));
        list.add(new Category("CAT-5", "Mystery", "Detective fiction, suspense thrillers, crime, and mysteries.", "bi-search"));
        list.add(new Category("CAT-6", "Personal Development", "Productivity, financial intelligence, habit building, and psychology.", "bi-graph-up-arrow"));
        return list;
    }
}
