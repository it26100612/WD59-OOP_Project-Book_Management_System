# Member 2: Book Inventory Management

**Course:** SE1020 Object Oriented Programming  
**Module:** Book Catalog & Inventory Management  
**Role:** Backend Developer & Inventory Specialist  
**Assigned Directory:** `BookNest_FINAL_DISTRIBUTION/Member_2_Book_Management`  
**Shared GenericDAO Coordinator:** Member 3  

---

## 1. Module Overview & Core Responsibilities

Member 2 is responsible for managing the entire book catalog, stock levels, search and filtering mechanisms, book details presentation, and administrative book CRUD operations.

### Key Responsibilities:
1. **Book Catalog CRUD:** Managing the lifecycle of books (create, read, update, delete).
2. **Inventory Stock Management:** Providing methods for stock reduction (`reduceStock()`) and inventory replenishment.
3. **Book Detail Interface:** Displaying book cover, metadata, price, ISBN, synopsis, and review aggregations.
4. **Search & Category Filtering:** Assisting frontend filtering by genre, keyword, and price ranges.
5. **Plain-Text File Persistence:** Managing `backend/data/books.txt` using Jackson JSON file streaming.
6. **Module-Specific Testing:** Executing and maintaining `backend/test-book-module.ps1` to verify book endpoints, stock logic, and file storage.

---

## 2. Master File Allocation for Member 2

| File Relative Path | Type | Primary Role & Description |
| :--- | :--- | :--- |
| `backend/data/books.txt` | Data / JSON | Plain-text JSON data store containing persisted Book inventory entities |
| `backend/src/main/java/com/booknest/model/Book.java` | Java Model | Primary entity representing a book with fields (`id`, `title`, `author`, `category`, `isbn`, `price`, `quantity`, `rating`, `reviewsCount`, etc.) |
| `backend/src/main/java/com/booknest/dao/BookFileDAO.java` | Java DAO | Plain-text file data access object implementing `GenericDAO<Book, String>` with auto-seeding capability |
| `backend/src/main/java/com/booknest/service/BookService.java` | Java Service | Business logic layer handling book validations, stock checks, and search algorithms |
| `backend/src/main/java/com/booknest/controller/BookController.java` | Java Controller | REST controller publishing endpoints under `/api/books/**` |
| `BookNest/books.html` | HTML Frontend | Customer book catalog page featuring category pills, search input, and dynamic book cards |
| `BookNest/book-details.html` | HTML Frontend | Book specifications page displaying high-resolution book details, stock availability, and review list |
| `BookNest/admin/books.html` | HTML Admin | Administrative book management interface featuring modal forms for book creation, edit, and deletion |
| `backend/test-book-module.ps1` | PowerShell | Automated module test suite testing book endpoints, price updates, and persistence |

---

## 3. Core OOP Concepts Implemented

### A. Encapsulation & Domain Logic Methods
- `Book.java` encapsulates all book attributes with strict private access.
- Business logic is directly embedded within the entity:
  ```java
  public boolean reduceStock(int count) {
      if (this.quantity >= count) {
          this.quantity -= count;
          return true;
      }
      return false;
  }
  ```
- Prevents invalid stock deductions and guarantees object invariant safety.

### B. Interface Implementation (GenericDAO)
- `BookFileDAO` implements `GenericDAO<Book, String>` created and maintained by Member 3, fulfilling standard persistence contracts (`findAll`, `findById`, `save`, `deleteById`).

### C. Abstraction
- Controllers interact with `BookService` through high-level abstractions without coupling to file I/O or raw JSON serialization.

---

## 4. REST API Endpoints Owned by Member 2

| Method | Endpoint | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/books` | List all books in catalog | None | `List<Book>` |
| `GET` | `/api/books/{id}` | Get book by unique ID | None | `Book` object |
| `POST` | `/api/books` | Add a new book to catalog | `Book` JSON | Created `Book` |
| `PUT` | `/api/books/{id}` | Update existing book details/stock | `Book` JSON | Updated `Book` |
| `DELETE` | `/api/books/{id}` | Remove book from catalog | None | `204 No Content` |

---

## 5. Inter-Member Interfaces & Technical Touchpoints

### Interface with Member 4 (Order Management):
* **Dependency:** When an order is placed in Member 4's `OrderService.createOrder()`, Member 4 needs to deduct book stock.
* **Touchpoint:** Member 4 injects `BookFileDAO` (or calls `BookService`), loads the book by ID, executes `book.reduceStock(quantity)`, and saves the updated book entity back to `books.txt`.

### Interface with Member 5 (Review Management):
* **Dependency:** When a customer posts or removes a review, the book's average star rating and review count must update.
* **Touchpoint:** Member 5's `ReviewService` queries reviews for `bookId`, calculates the average score, calls `book.setRating(avg)` and `book.setReviewsCount(count)`, and persists the updated `Book` record.

### Interface with Member 3 (Category Management & GenericDAO):
* `BookFileDAO` implements `GenericDAO<Book, String>`. Member 2 must coordinate with Member 3 for any shared interface changes. Books also reference category names managed by Member 3.

---

## 6. How to Run Module Tests

Ensure the Spring Boot backend is running, then execute in PowerShell:
```powershell
cd "Member_2_Book_Management/backend"
powershell -ExecutionPolicy Bypass -File "test-book-module.ps1"
```

---

## 7. Recommended Git Commit Plan

1. `feat(book): define Book entity with encapsulation and reduceStock domain method`
2. `feat(book-dao): implement BookFileDAO adhering to GenericDAO with auto-seeding`
3. `feat(book-service): create BookService for catalog filtering, search, and validation`
4. `feat(book-controller): build REST controller for /api/books CRUD endpoints`
5. `feat(book-ui): implement books.html catalog grid with category filters and search`
6. `feat(book-admin): develop admin/books.html management table with modal CRUD forms`
7. `test(book): add test-book-module.ps1 automated verification suite`
