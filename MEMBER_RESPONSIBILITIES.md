# Member 2: Book Inventory Management

**Course:** SE1020 Object Oriented Programming  
**Module:** Book Catalog & Inventory Management  
**Role:** Backend Developer & Inventory Specialist  
**Assigned Directory:** `BookNest_FINAL_DISTRIBUTION/Member_2_Book_Management`  
# Member 4: Order Management, Shopping Cart & Checkout

**Course:** SE1020 Object Oriented Programming  
**Module:** Shopping Cart, Checkout & Order Processing Lifecycle  
**Role:** Backend Developer & E-Commerce Transactions Specialist  
**Assigned Directory:** `BookNest_FINAL_DISTRIBUTION/Member_4_Order_Management`  
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
Member 4 is responsible for the entire e-commerce purchasing journey: managing shopping cart items, calculating totals and delivery fees, checkout form validation, placing orders, transitioning order statuses (Pending -> Processing -> Shipped -> Delivered -> Cancelled), and displaying customer order histories.

### Key Responsibilities:
1. **Shopping Cart Management:** Dynamic client-side quantity increments, item removal, and subtotal recalculation.
2. **Checkout Flow & Delivery Address:** Capturing delivery address, phone number, customer notes, and payment mode simulation (Cash on Delivery).
3. **Order Lifecycle & State Transitions:** Processing orders, generating unique IDs (`ORD-XXXX`), and managing administrative status transitions.
4. **Inventory Stock Coordination:** Deducting stock levels for purchased items through Member 2's `BookFileDAO`.
5. **Plain-Text File Persistence:** Managing `backend/data/orders.txt` using Jackson JSON file streaming.
6. **Module-Specific Testing:** Executing and maintaining `backend/test-order-module.ps1` to verify order placement, status updates, and composition integrity.

---

## 2. Master File Allocation for Member 4

| File Relative Path | Type | Primary Role & Description |
| :--- | :--- | :--- |
| `backend/data/orders.txt` | Data / JSON | Plain-text JSON data store containing persisted customer orders and composed line items |
| `backend/src/main/java/com/booknest/model/Order.java` | Java Model | Root aggregate entity modeling an order (`id`, `customerId`, `customerName`, `email`, `phone`, `items`, `total`, `status`, etc.) |
| `backend/src/main/java/com/booknest/model/OrderItem.java` | Java Model | Component entity representing an individual book line item within an order |
| `backend/src/main/java/com/booknest/dao/OrderFileDAO.java` | Java DAO | Plain-text file data access object implementing `GenericDAO<Order, String>` with status updating methods |
| `backend/src/main/java/com/booknest/service/OrderService.java` | Java Service | Business logic layer orchestrating order validation, total calculations, and book stock decrement |
| `backend/src/main/java/com/booknest/controller/OrderController.java` | Java Controller | REST controller publishing endpoints under `/api/orders/**` |
| `BookNest/cart.html` | HTML Frontend | Shopping cart interface showing itemized table, quantity spinners, subtotal, and checkout trigger |
| `BookNest/checkout.html` | HTML Frontend | Multi-step checkout form collecting delivery details and confirming payment method |
| `BookNest/orders.html` | HTML Frontend | Customer order history tracking page with status badges and printable order receipts |
| `BookNest/admin/orders.html` | HTML Admin | Administrative order management dashboard with status dropdowns and order details modals |
| `backend/test-order-module.ps1` | PowerShell | Automated module test suite testing order placement, status lifecycle, and persistence |

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
### A. Composition (Has-A Relationship)
- An `Order` has a composition relationship with `OrderItem`:
  ```java
  public class Order {
      private List<OrderItem> items = new ArrayList<>();
      // Lifecycle of OrderItem is bound to the parent Order
  }
  ```
- If an order is canceled or deleted, its associated line items are encapsulated within that order lifecycle.

### B. Inter-Service Collaboration & Encapsulation
- `OrderService` encapsulates transaction rules: calculating shipping fees (LKR 350 flat rate), validating non-empty item lists, and invoking stock deductions.

### C. Interface Implementation (GenericDAO)
- `OrderFileDAO` implements `GenericDAO<Order, String>` governed by Member 3, fulfilling standard CRUD requirements.

---

## 4. Technical Interface with Member 2 (Book Management)

> [!IMPORTANT]
> **ORDER-TO-BOOK INVENTORY INTERFACE CONTRACT:**
> When an order is placed (`POST /api/orders`):
> 1. Member 4's `OrderService` coordinates with Member 2's `BookFileDAO`.
> 2. For each `OrderItem` in the order:
>    ```java
>    Optional<Book> bookOpt = bookDAO.findById(item.getBookId());
>    if (bookOpt.isPresent()) {
>        Book book = bookOpt.get();
>        boolean stockReduced = book.reduceStock(item.getQuantity());
>        if (stockReduced) {
>            bookDAO.save(book);
>        }
>    }
>    ```
> 3. This guarantees that stock decrement logic remains encapsulated inside Member 2's `Book` class, while Member 4 orchestrates the purchasing workflow.

---

## 5. REST API Endpoints Owned by Member 4

| Method | Endpoint | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/orders` | List all orders | None | `List<Order>` |
| `GET` | `/api/orders/{id}` | Get order details by ID | None | `Order` object |
| `POST` | `/api/orders` | Submit new order & reduce stock | `Order` JSON | Created `Order` |
| `PATCH` | `/api/orders/{id}/status` | Update order delivery status | `{"status": "Shipped"}` | Updated `Order` |
| `DELETE` | `/api/orders/{id}` | Remove order record | None | `204 No Content` |

---

## 6. How to Run Module Tests

Ensure the Spring Boot backend is running, then execute in PowerShell:
```powershell
cd "Member_2_Book_Management/backend"
powershell -ExecutionPolicy Bypass -File "test-book-module.ps1"
cd "Member_4_Order_Management/backend"
powershell -ExecutionPolicy Bypass -File "test-order-module.ps1"
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
1. `feat(dao): architect GenericDAO generic interface parameterized with <T, ID>`
2. `feat(category): define Category entity with encapsulation and validation`
3. `feat(category-dao): implement CategoryFileDAO using GenericDAO and Jackson streaming`
4. `feat(category-service): implement CategoryService with duplicate validation logic`
5. `feat(category-controller): create REST controller for /api/categories endpoints`
6. `feat(category-admin): build admin/categories.html management page with modal editor`
7. `test(category): add test-category-module.ps1 automated verification suite`


# Member 6: System Integration, Architecture & Testing Lead

**Course:** SE1020 Object Oriented Programming  
**Module:** System Integration, Core Architecture, Shared Resources & Quality Assurance  
**Role:** Integration Lead & System Architect  
**Assigned Directory:** `BookNest_FINAL_DISTRIBUTION/Member_6_Integration_and_Testing`

---

## 1. Module Overview & Core Responsibilities

Member 6 leads system integration, build configuration, shared frontend libraries, global application layout, health monitoring, and system-level quality assurance.

### Rebalanced Workload Architecture:
To ensure fair distribution across the 6-member team:
- **Members 1 to 5** are directly responsible for testing their own modules (`test-user-module.ps1`, `test-book-module.ps1`, `test-category-module.ps1`, `test-order-module.ps1`, `test-review-module.ps1`), writing OOP domain models, DAOs, services, and module pages.
- **Member 6** focuses on **System Integration Testing**, end-to-end multi-module coordination, server startup lifecycle, master build automation, CORS configuration, and shared frontend design consistency.

### Key Responsibilities:
1. **Spring Boot Bootstrap & Configuration:** Managing `BookNestApplication.java`, `CorsConfig.java`, and `application.properties`.
2. **System Health & Heartbeat API:** Managing `HealthController.java` (`/api/health`).
3. **Build Toolchain & Dependency Management:** Managing `backend/pom.xml` and the bundled portable Apache Maven 3.9.6 toolchain.
4. **Shared Frontend Assets & Design System:** Primary owner and custodian of `BookNest/css/style.css`, `BookNest/js/data.js`, `BookNest/js/script.js`, `BookNest/js/admin.js`, theme banners, and payment gateway assets.
5. **Integrated Storefront & Admin Portal:** Managing the integrated customer landing homepage (`BookNest/index.html`), the administrative KPI analytics dashboard (`BookNest/admin/dashboard.html`), and the root entry redirector (`index.html`).
6. **System Integration Testing:** Authoring and executing the master backend integration suite (`test-backend.ps1`) and the frontend-backend sync verification suite (`test-frontend-integration.ps1`).
7. **Comprehensive Documentation:** Maintaining the master `BookNest/README.md` project guide.

---

## 2. Master File Allocation for Member 6

| File Relative Path | Type | Primary Role & Description |
| :--- | :--- | :--- |
| `index.html` | HTML Entry | Root application entry redirector pointing to `BookNest/index.html` |
| `backend/pom.xml` | Maven Descriptor | Project Object Model specifying Spring Boot dependencies and build configuration |
| `backend/src/main/resources/application.properties` | Configuration | Server port (8080) and file data directory configuration (`./data`) |
| `backend/src/main/java/com/booknest/BookNestApplication.java` | Java Boot | Main Spring Boot application entry point with `@SpringBootApplication` |
| `backend/src/main/java/com/booknest/config/CorsConfig.java` | Java Config | Cross-Origin Resource Sharing (CORS) configuration for client-server decoupling |
| `backend/src/main/java/com/booknest/controller/HealthController.java` | Java Controller | System heartbeat endpoint (`GET /api/health`) |
| `backend/check-setup.ps1` | PowerShell | Environment validator checking Java JDK and Maven readiness |
| `backend/run.bat` | Windows Batch | Windows command prompt launcher script |
| `backend/run.ps1` | PowerShell | Windows PowerShell backend launch script |
| `backend/setup-maven.ps1` | PowerShell | Portable Apache Maven setup utility |
| `backend/test-backend.ps1` | PowerShell | Master backend REST automated integration test suite |
| `backend/test-frontend-integration.ps1` | PowerShell | Frontend-backend synchronization verification suite (online/offline mode) |
| `backend/tools/apache-maven-3.9.6/**` | Toolchain | Portable Apache Maven 3.9.6 distribution (89 bundled files) |
| `BookNest/index.html` | HTML Frontend | Integrated customer storefront homepage with hero banner and book showcases |
| `BookNest/admin/dashboard.html` | HTML Admin | Integrated administrative analytics dashboard displaying KPIs and quick links |
| `BookNest/css/style.css` | CSS Stylesheet | Master design system: color palette, typography, responsive grids, and components |
| `BookNest/js/data.js` | JavaScript | Central client-side data engine supporting dual-mode (LocalStorage & Spring REST) |
| `BookNest/js/script.js` | JavaScript | Customer storefront client logic (navbar search, cart badge, auth state) |
| `BookNest/js/admin.js` | JavaScript | Administrative portal client logic (sidebar, auth guard, layout) |
| `BookNest/README.md` | Markdown | Comprehensive project documentation, architecture diagram, and viva guide |
| `BookNest/images/booknest-hero-bg.png` | Image / Asset | Hero banner graphic for homepage showcase |
| `BookNest/images/blue-wave-bg.png` | Image / Asset | Global wave background asset |
| `BookNest/images/bundle-books.png` | Image / Asset | Promotional book bundle graphic |
| `BookNest/images/harrypotter.png` | Image / Asset | Default book cover graphic |
| `BookNest/images/payments/*.png` (13 files) | Image / Assets | Payment gateway brand badges (Visa, Mastercard, Amex, Genie, etc.) |

---

## 3. Core OOP Concepts Implemented

### A. Inversion of Control & Dependency Injection
- `BookNestApplication.java` configures the Spring container (`SpringApplication.run`).
- Coordinates component scanning and dependency injection across all controllers (`@RestController`), services (`@Service`), and DAOs (`@Repository`).

### B. Separation of Concerns & Cross-Cutting Configuration
- `CorsConfig.java` implements `WebMvcConfigurer`, centralizing cross-origin security rules rather than scattering annotations across individual member controllers.

### C. Client-Side Adapter / Strategy Pattern
- `BookNest/js/data.js` abstracts data persistence for the web frontend:
  If the Spring Boot server is online, it dynamically delegates calls via `fetch()` to REST endpoints. If the server is offline, it transparently falls back to `localStorage`, guaranteeing zero application downtime during student demonstrations.

---

## 4. Shared Frontend Governance & Coordination Rules

> [!IMPORTANT]
> **GOVERNANCE RULE FOR SHARED ASSETS:**
> Member 6 is the primary owner and custodian of `style.css`, `data.js`, `script.js`, `admin.js`, and the `images/` directory.
>
> **Coordination Protocol:**
> 1. **CSS Styles:** Each member styles their HTML components using the CSS classes defined in `style.css`. If new custom styles are needed, members coordinate with Member 6 to add them to the dedicated module section of `style.css`.
> 2. **Data Engine (`data.js`):** Member 6 manages `syncFromBackend()` and REST synchronization. Members 1-5 provide their module CRUD functions according to the standard signatures.
> 3. **Navigation & Session (`script.js`):** Member 6 maintains the global navbar and footer. Member 1 coordinates with Member 6 for session token retrieval.

---

## 5. Master Integration Test Execution

Member 6 oversees end-to-end integration testing:

### A. Run Master Backend REST Test Suite:
```powershell
cd "Member_6_Integration_and_Testing/backend"
powershell -ExecutionPolicy Bypass -File "test-backend.ps1"
```

### B. Run Frontend-Backend Dual-Mode Sync Suite:
```powershell
cd "Member_6_Integration_and_Testing/backend"
powershell -ExecutionPolicy Bypass -File "test-frontend-integration.ps1"
```

---

## 6. Recommended Git Commit Plan

1. `chore(build): configure pom.xml with Spring Boot 3.3.4 and Jackson dependencies`
2. `feat(config): implement CorsConfig WebMvcConfigurer and HealthController`
3. `feat(design-system): author master style.css design system and responsive tokens`
4. `feat(data-engine): architect dual-mode data.js supporting REST and LocalStorage`
5. `feat(homepage): construct integrated customer storefront index.html with hero banners`
6. `feat(admin-dashboard): build admin/dashboard.html KPI metrics and quick actions`
7. `test(integration): create automated test-backend.ps1 and test-frontend-integration.ps1 suites`
8. `docs(readme): author comprehensive BookNest architecture and coursework guide`
1. `feat(book): define Book entity with encapsulation and reduceStock domain method`
2. `feat(book-dao): implement BookFileDAO adhering to GenericDAO with auto-seeding`
3. `feat(book-service): create BookService for catalog filtering, search, and validation`
4. `feat(book-controller): build REST controller for /api/books CRUD endpoints`
5. `feat(book-ui): implement books.html catalog grid with category filters and search`
6. `feat(book-admin): develop admin/books.html management table with modal CRUD forms`
7. `test(book): add test-book-module.ps1 automated verification suite`
1. `feat(order): define Order root entity and OrderItem component entity (Composition)`
2. `feat(order-dao): implement OrderFileDAO adhering to GenericDAO with status update methods`
3. `feat(order-service): integrate OrderService with BookFileDAO for inventory decrement`
4. `feat(order-controller): build REST endpoints for /api/orders and status patch`
5. `feat(order-ui): create interactive cart.html with live subtotal and shipping calculations`
6. `feat(order-checkout): develop checkout.html and customer orders.html history views`
7. `feat(order-admin): build admin/orders.html with order inspection and status lifecycle modals`
8. `test(order): add test-order-module.ps1 automated verification suite`
