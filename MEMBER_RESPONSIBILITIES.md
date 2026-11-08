# Member 5: Review Management & Static Information Pages

**Course:** SE1020 Object Oriented Programming  
**Module:** Customer Feedback, Review Moderation & Static Storefront Pages  
**Role:** Backend Developer & Content/Reputation Specialist  
**Assigned Directory:** `BookNest_FINAL_DISTRIBUTION/Member_5_Review_and_Static_Pages`  
**Shared GenericDAO Coordinator:** Member 3  

---

## 1. Module Overview & Core Responsibilities

Member 5 oversees customer reviews and ratings (1 to 5 stars), the calculation of aggregate book ratings, administrative review moderation, and the entire suite of informational static policy pages.

### Key Responsibilities:
1. **Customer Review CRUD:** Allowing customers to post star ratings and text feedback on books.
2. **Dynamic Rating Aggregation:** Recalculating average book ratings and review counts upon review creation or deletion.
3. **Administrative Moderation:** Managing customer feedback on `admin/reviews.html` with inspection and deletion privileges.
4. **Static Informational Pages:** Maintaining the five essential bookstore policy and company pages (`about.html`, `contact.html`, `delivery.html`, `privacy.html`, `terms.html`).
5. **Plain-Text File Persistence:** Managing `backend/data/reviews.txt` using Jackson JSON file streaming.
6. **Module-Specific Testing:** Executing and maintaining `backend/test-review-module.ps1` to verify review endpoints, rating updates, and static page existence.

---

## 2. Master File Allocation for Member 5

| File Relative Path | Type | Primary Role & Description |
| :--- | :--- | :--- |
| `backend/data/reviews.txt` | Data / JSON | Plain-text JSON data store containing persisted customer book reviews |
| `backend/src/main/java/com/booknest/model/Review.java` | Java Model | Entity class modeling a review (`id`, `bookId`, `bookTitle`, `customerName`, `rating`, `comment`, `date`) |
| `backend/src/main/java/com/booknest/dao/ReviewFileDAO.java` | Java DAO | Plain-text file data access object implementing `GenericDAO<Review, String>` with book filtering |
| `backend/src/main/java/com/booknest/service/ReviewService.java` | Java Service | Business logic layer validating star bounds (1-5) and recalculating aggregate book ratings |
| `backend/src/main/java/com/booknest/controller/ReviewController.java` | Java Controller | REST controller publishing endpoints under `/api/reviews/**` |
| `BookNest/admin/reviews.html` | HTML Admin | Administrative review moderation interface with filter tabs, rating stars, and delete action |
| `BookNest/about.html` | HTML Static | Company profile, bookstore mission statement, and core values |
| `BookNest/contact.html` | HTML Static | Bookstore branch locations, phone numbers, email inquiry form, and working hours |
| `BookNest/delivery.html` | HTML Static | Islandwide delivery rates, shipping policies, tracking guidelines, and estimated arrival times |
| `BookNest/privacy.html` | HTML Static | Comprehensive privacy policy regarding user accounts, transactions, and data security |
| `BookNest/terms.html` | HTML Static | Terms and conditions governing online ordering, returns, refunds, and user agreements |
| `backend/test-review-module.ps1` | PowerShell | Automated module test suite testing reviews, rating calculation, and static page integrity |

---

## 3. Core OOP Concepts Implemented

### A. Encapsulation & Input Invariants
- `Review.java` encapsulates star rating validation (`rating >= 1 && rating <= 5`) and non-empty comment requirements.

### B. Mediator / Coordination Pattern
- `ReviewService` acts as a mediator between reviews and books:
  When a review is saved or deleted, `ReviewService` computes the arithmetic mean of all ratings for that specific `bookId` and invokes Member 2's `BookFileDAO` to update the book's aggregate rating.

### C. Interface Implementation (GenericDAO)
- `ReviewFileDAO` implements `GenericDAO<Review, String>` governed by Member 3, fulfilling standard persistence requirements.

---

## 4. Technical Interface with Member 2 (Book Management)

> [!IMPORTANT]
> **REVIEW-TO-BOOK RATING INTERFACE CONTRACT:**
> When a customer submits a new review (`POST /api/reviews`) or an admin deletes an inappropriate review:
> 1. Member 5's `ReviewService` fetches all active reviews for that `bookId`:
>    ```java
>    List<Review> bookReviews = reviewDAO.findByBookId(bookId);
>    double average = bookReviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
>    double roundedAvg = Math.round(average * 10.0) / 10.0;
>    ```
> 2. `ReviewService` then retrieves the target `Book` using Member 2's `BookFileDAO.findById(bookId)`.
> 3. It sets `book.setRating(roundedAvg)` and `book.setReviewsCount(bookReviews.size())`.
> 4. It saves the book via `bookDAO.save(book)`.
> 5. This guarantees real-time rating synchronization across the book catalog.

---

## 5. REST API Endpoints Owned by Member 5

| Method | Endpoint | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/reviews` | List all reviews | None | `List<Review>` |
| `GET` | `/api/reviews/{id}` | Get review by ID | None | `Review` object |
| `GET` | `/api/reviews/book/{bookId}` | List reviews for a specific book | None | `List<Review>` |
| `POST` | `/api/reviews` | Submit new review & update book rating | `Review` JSON | Created `Review` |
| `DELETE` | `/api/reviews/{id}` | Remove review & recalculate rating | None | `204 No Content` |

---

## 6. How to Run Module Tests

Ensure the Spring Boot backend is running, then execute in PowerShell:
```powershell
cd "Member_5_Review_and_Static_Pages/backend"
powershell -ExecutionPolicy Bypass -File "test-review-module.ps1"
```

---

## 7. Recommended Git Commit Plan

1. `feat(review): define Review entity with rating bounds validation`
2. `feat(review-dao): implement ReviewFileDAO adhering to GenericDAO with findByBookId`
3. `feat(review-service): create ReviewService with automated book rating recalculation`
4. `feat(review-controller): publish REST endpoints for /api/reviews and /api/reviews/book/{id}`
5. `feat(static-pages): construct responsive about, contact, delivery, privacy, and terms pages`
6. `feat(review-admin): develop admin/reviews.html moderation table with star displays`
7. `test(review): add test-review-module.ps1 automated verification suite`
