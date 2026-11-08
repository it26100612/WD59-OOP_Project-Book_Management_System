# Member 3: Category Management & Generic DAO Architecture

**Course:** SE1020 Object Oriented Programming  
**Module:** Category Taxonomy & Foundational Generic Persistence Architecture  
**Role:** Core Architecture Lead & Taxonomy Specialist  
**Assigned Directory:** `BookNest_FINAL_DISTRIBUTION/Member_3_Category_Management`  
**Key Shared Asset Ownership:** Primary Owner and Custodian of `GenericDAO.java`  

---

## 1. Module Overview & Core Responsibilities

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
cd "Member_3_Category_Management/backend"
powershell -ExecutionPolicy Bypass -File "test-category-module.ps1"
```

---

## 7. Recommended Git Commit Plan

1. `feat(dao): architect GenericDAO generic interface parameterized with <T, ID>`
2. `feat(category): define Category entity with encapsulation and validation`
3. `feat(category-dao): implement CategoryFileDAO using GenericDAO and Jackson streaming`
4. `feat(category-service): implement CategoryService with duplicate validation logic`
5. `feat(category-controller): create REST controller for /api/categories endpoints`
6. `feat(category-admin): build admin/categories.html management page with modal editor`
7. `test(category): add test-category-module.ps1 automated verification suite`
