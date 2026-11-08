package com.booknest.service;

import com.booknest.dao.BookFileDAO;
import com.booknest.model.Book;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service Layer: BookService
 * Contains business logic for book management.
 */
@Service
public class BookService {
    private final BookFileDAO bookDAO;

    public BookService(BookFileDAO bookDAO) {
        this.bookDAO = bookDAO;
    }

    public List<Book> getAllBooks() {
        return bookDAO.findAll();
    }

    public Optional<Book> getBookById(String id) {
        return bookDAO.findById(id);
    }

    public List<Book> getBooksByCategory(String category) {
        return bookDAO.findAll().stream()
                .filter(b -> b.getCategory() != null && b.getCategory().equalsIgnoreCase(category))
                .collect(Collectors.toList());
    }

    public List<Book> searchBooks(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllBooks();
        }
        String q = query.toLowerCase();
        return bookDAO.findAll().stream()
                .filter(b -> (b.getTitle() != null && b.getTitle().toLowerCase().contains(q)) ||
                             (b.getAuthor() != null && b.getAuthor().toLowerCase().contains(q)) ||
                             (b.getCategory() != null && b.getCategory().toLowerCase().contains(q)))
                .collect(Collectors.toList());
    }

    public Book saveBook(Book book) {
        // Business Validation
        if (book.getTitle() == null || book.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Book title cannot be empty.");
        }
        if (book.getPrice() < 0) {
            book.setPrice(0.0);
        }
        if (book.getQuantity() < 0) {
            book.setQuantity(0);
        }
        return bookDAO.save(book);
    }

    public boolean deleteBook(String id) {
        return bookDAO.deleteById(id);
    }
}
