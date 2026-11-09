package com.booknest.dao;

import java.util.List;
import java.util.Optional;

/**
 * Generic Data Access Object (DAO) Interface
 * Demonstrates Abstraction and Interface-based Polymorphism for SE1020 OOP.
 */
public interface GenericDAO<T, ID> {
    List<T> findAll();
    Optional<T> findById(ID id);
    T save(T entity);
    boolean deleteById(ID id);
}
