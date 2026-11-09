# Member 5: Review Management & Static Information Pages

**Course:** SE1020 Object Oriented Programming  
**Module:** Customer Feedback, Review Moderation & Static Storefront Pages  
**Role:** Backend Developer & Content/Reputation Specialist  
**Assigned Directory:** `BookNest_FINAL_DISTRIBUTION/Member_5_Review_and_Static_Pages`  
**Shared GenericDAO Coordinator:** Member 3  
# Member 3: Category Management & Generic DAO Architecture

**Course:** SE1020 Object Oriented Programming  
**Module:** Category Taxonomy & Foundational Generic Persistence Architecture  
**Role:** Core Architecture Lead & Taxonomy Specialist  
**Assigned Directory:** `BookNest_FINAL_DISTRIBUTION/Member_3_Category_Management`  
**Key Shared Asset Ownership:** Primary Owner and Custodian of `GenericDAO.java`  

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
Member 3 holds a pivotal dual responsibility:
1. **Architect of Generic Data Access:** Authoring, maintaining, and governing the `GenericDAO<T, ID>` interface that defines the data access standard implemented by all five persistent DAOs in the application.
2. **Category Taxonomy Management:** Managing book categories/genres, category CRUD operations, taxonomy icons, and the administrative category management portal.
3. **Plain-Text File Persistence:** Managing `backend/data/categories.txt` using Jackson JSON file streaming.
4. **Module-Specific Testing:** Executing and maintaining `backend/test-category-module.ps1` to verify category endpoints, GenericDAO contract adherence, and file persistence.

---

## 2. Master File Allocation for Member 3

| File Relative Path | Type | Primary Role & Description |
| :--- | :--- | :--- |
| `backend/src/main/java/com/booknest/dao/GenericDAO.java` | Java Interface | Foundational Generic Data Access Object interface parameterized with `<T, ID>` |
| `backend/data/categories.txt` | Data / JSON | Plain-text JSON data store containing persisted Category taxonomy entities |
| `backend/src/main/java/com/booknest/model/Category.java` | Java Model | Entity class modeling a category (`id`, `name`, `description`, `icon`) |
| `backend/src/main/java/com/booknest/dao/CategoryFileDAO.java` | Java DAO | Plain-text file data access object implementing `GenericDAO<Category, String>` |
| `backend/src/main/java/com/booknest/service/CategoryService.java` | Java Service | Business logic layer validating category names, duplicates, and taxonomy constraints |
| `backend/src/main/java/com/booknest/controller/CategoryController.java` | Java Controller | REST controller publishing endpoints under `/api/categories/**` |
| `BookNest/admin/categories.html` | HTML Admin | Administrative category management interface with icon pickers and CRUD forms |
| `backend/test-category-module.ps1` | PowerShell | Automated module test suite testing category CRUD, GenericDAO, and persistence |

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
### A. Generic Interface Abstraction (`GenericDAO<T, ID>`)
Member 3 created the core generic persistence interface:
```java
package com.booknest.dao;

import java.util.List;
import java.util.Optional;

public interface GenericDAO<T, ID> {
    List<T> findAll();
    Optional<T> findById(ID id);
    T save(T entity);
    void deleteById(ID id);
    boolean existsById(ID id);
}
```
- **Parametric Polymorphism (Generics):** By parameterizing entity type `T` and identifier type `ID`, `GenericDAO` decouples the persistence contract from specific models.
- **Contract Enforcement:** Guarantees that all DAO implementations across the team adhere to identical method naming, signatures, and return conventions.

### B. Encapsulation & Entity Integrity
- `Category.java` encapsulates category identifiers and metadata, preventing invalid null or empty category names through validated setters.

---

## 4. Primary Ownership & Strict Governance of `GenericDAO.java`

> [!IMPORTANT]
> **GOVERNANCE RULE FOR GENERICDAO.JAVA:**
> Member 3 is the sole primary owner of `backend/src/main/java/com/booknest/dao/GenericDAO.java`.
> Because this interface is directly implemented by:
> - Member 1: `UserFileDAO`
> - Member 2: `BookFileDAO`
> - Member 3: `CategoryFileDAO`
> - Member 4: `OrderFileDAO`
> - Member 5: `ReviewFileDAO`
> 
> **Any proposed change, addition, or refactoring of `GenericDAO.java` MUST be submitted to and approved by Member 3.** No member may modify this file unilaterally, as doing so introduces breaking compilation changes across all five modules.

---

## 5. REST API Endpoints Owned by Member 3

| Method | Endpoint | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | List all active categories | None | `List<Category>` |
| `GET` | `/api/categories/{id}` | Get category by ID | None | `Category` object |
| `POST` | `/api/categories` | Create a new category | `Category` JSON | Created `Category` |
| `PUT` | `/api/categories/{id}` | Update existing category | `Category` JSON | Updated `Category` |
| `DELETE` | `/api/categories/{id}` | Delete category | None | `204 No Content` |

---

## 6. How to Run Module Tests

Ensure the Spring Boot backend is running, then execute in PowerShell:
```powershell
cd "Member_5_Review_and_Static_Pages/backend"
powershell -ExecutionPolicy Bypass -File "test-review-module.ps1"
cd "Member_3_Category_Management/backend"
powershell -ExecutionPolicy Bypass -File "test-category-module.ps1"
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
