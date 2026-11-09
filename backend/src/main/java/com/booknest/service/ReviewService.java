package com.booknest.service;

import com.booknest.dao.BookFileDAO;
import com.booknest.dao.ReviewFileDAO;
import com.booknest.model.Book;
import com.booknest.model.Review;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service Layer: ReviewService
 * Coordinates customer feedback and updates book aggregate ratings.
 */
@Service
public class ReviewService {
    private final ReviewFileDAO reviewDAO;
    private final BookFileDAO bookDAO;

    public ReviewService(ReviewFileDAO reviewDAO, BookFileDAO bookDAO) {
        this.reviewDAO = reviewDAO;
        this.bookDAO = bookDAO;
    }

    public List<Review> getAllReviews() {
        return reviewDAO.findAll();
    }

    public List<Review> getReviewsByBookId(String bookId) {
        return reviewDAO.findByBookId(bookId);
    }

    public Optional<Review> getReviewById(String id) {
        return reviewDAO.findById(id);
    }

    public Review saveReview(Review review) {
        if (review.getRating() < 1 || review.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5 stars.");
        }

        Review saved = reviewDAO.save(review);
        updateBookAggregateRating(review.getBookId());
        return saved;
    }

    public boolean deleteReview(String id) {
        Optional<Review> revOpt = reviewDAO.findById(id);
        if (revOpt.isPresent()) {
            String bookId = revOpt.get().getBookId();
            boolean deleted = reviewDAO.deleteById(id);
            if (deleted) {
                updateBookAggregateRating(bookId);
            }
            return deleted;
        }
        return false;
    }

    private void updateBookAggregateRating(String bookId) {
        if (bookId == null) return;
        List<Review> bookReviews = reviewDAO.findByBookId(bookId);
        Optional<Book> bookOpt = bookDAO.findById(bookId);
        if (bookOpt.isPresent()) {
            Book book = bookOpt.get();
            if (bookReviews.isEmpty()) {
                book.setRating(5.0);
                book.setReviewsCount(0);
            } else {
                double sum = 0.0;
                for (Review r : bookReviews) {
                    sum += r.getRating();
                }
                double avg = Math.round((sum / bookReviews.size()) * 10.0) / 10.0;
                book.setRating(avg);
                book.setReviewsCount(bookReviews.size());
            }
            bookDAO.save(book);
        }
    }
}
