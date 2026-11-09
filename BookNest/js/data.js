/**
 * BookNest — Online Bookstore Management System
 * SE1020 Object Oriented Programming Project
 * 
 * data.js: Initial sample data and localStorage data management engine.
 * Organized cleanly so functions can later be replaced with REST API calls
 * to the Java backend (Spring Boot / Servlet / File I/O).
 */

// Initial Seed Data
const INITIAL_BOOKS = [
  {
    id: "BK-1001",
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    category: "Fiction",
    isbn: "978-0747532743",
    price: 2850,
    quantity: 24,
    rating: 4.9,
    reviewsCount: 38,
    featured: false,
    bestseller: false,
    newArrival: false,
    cover: "https://images.unsplash.com/photo-1618666012174-83b441c0bc76?auto=format&fit=crop&w=600&q=80",
    description: "Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle. Then, on Harry's eleventh birthday, a great beetle-eyed giant of a man called Rubeus Hagrid bursts in with astonishing news: Harry Potter is a wizard, and he has a place at Hogwarts School of Witchcraft and Wizardry.",
    publisher: "Bloomsbury Publishing",
    publishedYear: 1997,
    pages: 223,
    language: "English",
    format: "Paperback"
  },
  {
    id: "BK-1002",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    category: "Fiction",
    isbn: "978-0261102217",
    price: 3200,
    quantity: 18,
    rating: 4.8,
    reviewsCount: 29,
    featured: false,
    bestseller: false,
    newArrival: false,
    cover: "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?auto=format&fit=crop&w=600&q=80",
    description: "Whisked away from his comfortable, unambitious life in Hobbiton by the wizard Gandalf and a company of thirteen dwarves, Bilbo Baggins finds himself caught up in a plot to raid the treasure hoard of Smaug the Magnificent, a large and very dangerous dragon.",
    publisher: "HarperCollins",
    publishedYear: 1937,
    pages: 310,
    language: "English",
    format: "Hardcover"
  },
  {
    id: "BK-1003",
    title: "Atomic Habits",
    author: "James Clear",
    category: "Personal Development",
    isbn: "978-0735211292",
    price: 3750,
    quantity: 45,
    rating: 4.9,
    reviewsCount: 64,
    featured: false,
    bestseller: false,
    newArrival: false,
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80",
    description: "No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.",
    publisher: "Avery / Penguin Random House",
    publishedYear: 2018,
    pages: 320,
    language: "English",
    format: "Paperback"
  },
  {
    id: "BK-1004",
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    category: "Personal Development",
    isbn: "978-1612680194",
    price: 2900,
    quantity: 32,
    rating: 4.7,
    reviewsCount: 52,
    featured: false,
    bestseller: false,
    newArrival: false,
    cover: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=600&q=80",
    description: "Rich Dad Poor Dad is Robert's story of growing up with two dads — his real father and the father of his best friend, his rich dad — and the ways in which both men shaped his thoughts about money and investing. The book explodes the myth that you need to earn a high income to be rich and explains the difference between working for money and having your money work for you.",
    publisher: "Plata Publishing",
    publishedYear: 1997,
    pages: 336,
    language: "English",
    format: "Paperback"
  },
  {
    id: "BK-1005",
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin",
    category: "Technology",
    isbn: "978-0132350884",
    price: 6400,
    quantity: 15,
    rating: 4.9,
    reviewsCount: 41,
    featured: false,
    bestseller: false,
    newArrival: false,
    cover: "https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=600&q=80",
    description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. Clean Code teaches the principles, patterns, and practices of writing clean software in object-oriented systems.",
    publisher: "Prentice Hall",
    publishedYear: 2008,
    pages: 464,
    language: "English",
    format: "Paperback"
  },
  {
    id: "BK-1006",
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein",
    category: "Education",
    isbn: "978-0262033848",
    price: 8900,
    quantity: 8,
    rating: 4.8,
    reviewsCount: 19,
    featured: false,
    bestseller: false,
    newArrival: false,
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
    description: "Some books on algorithms are rigorous but incomplete; others cover masses of material but lack rigor. Introduction to Algorithms uniquely combines rigor and comprehensiveness. The book covers a broad range of algorithms in depth, yet makes their design and analysis accessible to all levels of readers.",
    publisher: "MIT Press",
    publishedYear: 2009,
    pages: 1292,
    language: "English",
    format: "Hardcover"
  },
  {
    id: "BK-1007",
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    category: "Science",
    isbn: "978-0553380163",
    price: 3450,
    quantity: 14,
    rating: 4.7,
    reviewsCount: 22,
    featured: false,
    bestseller: false,
    newArrival: false,
    cover: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    description: "A landmark volume in science writing by one of the great minds of our time, Stephen Hawking explores profound questions about the universe: How did it begin? What makes it tick? Is time travel possible? Hawking writes in non-technical terms for curious readers who want to understand cosmology.",
    publisher: "Bantam Books",
    publishedYear: 1988,
    pages: 256,
    language: "English",
    format: "Paperback"
  },
  {
    id: "BK-1008",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    category: "Science",
    isbn: "978-0062316097",
    price: 4100,
    quantity: 26,
    rating: 4.8,
    reviewsCount: 47,
    featured: false,
    bestseller: false,
    newArrival: false,
    cover: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
    description: "One hundred thousand years ago, at least six different species of humans inhabited Earth. Yet today there is only one: Homo sapiens. What happened to the others? And what might happen to us? Yuval Noah Harari spans the whole of human history, from the very first humans to the cognitive and technological revolutions.",
    publisher: "Harper",
    publishedYear: 2014,
    pages: 443,
    language: "English",
    format: "Paperback"
  },
  {
    id: "BK-1009",
    title: "The Da Vinci Code",
    author: "Dan Brown",
    category: "Mystery",
    isbn: "978-0307474278",
    price: 2650,
    quantity: 20,
    rating: 4.6,
    reviewsCount: 31,
    featured: false,
    bestseller: false,
    newArrival: false,
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80",
    description: "While in Paris, Harvard symbologist Robert Langdon is awakened in the middle of the night by a telephone call: the elderly curator of the Louvre has been murdered inside the museum. Beside the body, police found a baffling cipher. Langdon joins forces with a French cryptologist, Sophie Neveu, to unravel a sequence of clues.",
    publisher: "Anchor Books",
    publishedYear: 2003,
    pages: 489,
    language: "English",
    format: "Paperback"
  },
  {
    id: "BK-1010",
    title: "Sherlock Holmes: The Complete Novels and Stories",
    author: "Sir Arthur Conan Doyle",
    category: "Mystery",
    isbn: "978-0553212419",
    price: 3950,
    quantity: 12,
    rating: 4.9,
    reviewsCount: 28,
    featured: false,
    bestseller: false,
    newArrival: false,
    cover: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=600&q=80",
    description: "Since his first appearance in A Study in Scarlet in 1887, detective Sherlock Holmes has fascinated millions with his brilliant deductive reasoning and unmatched keenness of observation. This edition gathers the timeless cases solved by Holmes and Dr. John Watson at 221B Baker Street.",
    publisher: "Bantam Classics",
    publishedYear: 1986,
    pages: 832,
    language: "English",
    format: "Paperback"
  },
  {
    id: "BK-9374",
    title: "The Diary of a Wimpy Kid",
    author: "Jeff Kinney",
    category: "Fiction",
    isbn: "9780241745168",
    price: 2000,
    quantity: 25,
    rating: 5,
    reviewsCount: 34,
    featured: true,
    bestseller: true,
    newArrival: false,
    cover: "https://www.abramsbooks.com/cover_images/2/9781419741852_s3.jpg",
    description: "Deep work is the ability to focus without distraction on a cognitively demanding task. It is a superpower in our increasingly competitive twenty-first-century economy. Cal Newport flips the narrative on impact in an age of constant connectivity, providing a rigorous training regimen to transform your habits.",
    publisher: "Grand Central Publishing",
    publishedYear: 2016,
    pages: 304,
    language: "English",
    format: "Hardcover"
  },
  {
    id: "BK-1012",
    title: "Python Crash Course: A Hands-On, Project-Based Introduction",
    author: "Eric Matthes",
    category: "Technology",
    isbn: "978-1593279288",
    price: 5800,
    quantity: 16,
    rating: 4.9,
    reviewsCount: 25,
    featured: false,
    bestseller: false,
    newArrival:false,
    cover: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=600&q=80",
    description: "Python Crash Course is the world's bestselling guide to the Python programming language. This fast-paced, thorough introduction will have you writing programs, solving problems, and developing games and web applications that work in no time.",
    publisher: "No Starch Press",
    publishedYear: 2019,
    pages: 544,
    language: "English",
    format: "Paperback"
  }
];

const INITIAL_CATEGORIES = [
  {
    id: "CAT-1",
    name: "Fiction",
    description: "Novels, fantasy, literature, and classic storytelling.",
    icon: "bi-book"
  },
  {
    id: "CAT-2",
    name: "Science",
    description: "Physics, biology, space exploration, and scientific discovery.",
    icon: "bi-lightbulb"
  },
  {
    id: "CAT-3",
    name: "Technology",
    description: "Software engineering, programming languages, and computing.",
    icon: "bi-laptop"
  },
  {
    id: "CAT-4",
    name: "Education",
    description: "Academic textbooks, algorithms, mathematics, and student guides.",
    icon: "bi-mortarboard"
  },
  {
    id: "CAT-5",
    name: "Mystery",
    description: "Detective fiction, suspense thrillers, crime, and mysteries.",
    icon: "bi-search"
  },
  {
    id: "CAT-6",
    name: "Personal Development",
    description: "Productivity, financial intelligence, habit building, and psychology.",
    icon: "bi-graph-up-arrow"
  }
];

const INITIAL_USERS = [
  {
    id: "USR-1001",
    name: "Kasun Perera",
    email: "admin@booknest.lk",
    phone: "+94 77 123 4567",
    role: "Admin",
    status: "Active",
    address: "12/3 Lotus Road, Colombo 03",
    registeredDate: "2026-01-15"
  },
  {
    id: "USR-1002",
    name: "Amaya Fernando",
    email: "amaya@gmail.com",
    phone: "+94 71 987 6543",
    role: "Customer",
    status: "Active",
    address: "45 Galle Road, Mount Lavinia",
    registeredDate: "2026-02-10"
  },
  {
    id: "USR-1003",
    name: "Dilshan Silva",
    email: "dilshan@yahoo.com",
    phone: "+94 76 543 2109",
    role: "Customer",
    status: "Active",
    address: "88 Kandy Road, Kiribathgoda",
    registeredDate: "2026-03-01"
  },
  {
    id: "USR-1004",
    name: "Kavindi Senanayake",
    email: "kavindi@gmail.com",
    phone: "+94 70 334 5566",
    role: "Customer",
    status: "Active",
    address: "24 Peradeniya Road, Kandy",
    registeredDate: "2026-03-18"
  },
  {
    id: "USR-1005",
    name: "Nuwan Bandara",
    email: "nuwan@booknest.lk",
    phone: "+94 78 889 9001",
    role: "Staff",
    status: "Active",
    address: "105 Station Road, Nugegoda",
    registeredDate: "2026-02-28"
  }
];

const INITIAL_ORDERS = [
  {
    id: "ORD-1001",
    customerId: "USR-1002",
    customerName: "Amaya Fernando",
    email: "amaya@gmail.com",
    phone: "+94 71 987 6543",
    date: "2026-10-02",
    deliveryAddress: "45 Galle Road, Mount Lavinia",
    notes: "Please call before delivery.",
    items: [
      { bookId: "BK-1003", title: "Atomic Habits", price: 3750, quantity: 1, cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80" },
      { bookId: "BK-1001", title: "Harry Potter and the Philosopher's Stone", price: 2850, quantity: 1, cover: "https://images.unsplash.com/photo-1618666012174-83b441c0bc76?auto=format&fit=crop&w=600&q=80" }
    ],
    subtotal: 6600,
    shippingFee: 350,
    total: 6950,
    status: "Delivered"
  },
  {
    id: "ORD-1002",
    customerId: "USR-1003",
    customerName: "Dilshan Silva",
    email: "dilshan@yahoo.com",
    phone: "+94 76 543 2109",
    date: "2026-10-05",
    deliveryAddress: "88 Kandy Road, Kiribathgoda",
    notes: "Leave package at reception if unavailable.",
    items: [
      { bookId: "BK-1005", title: "Clean Code: A Handbook of Agile Software Craftsmanship", price: 6400, quantity: 1, cover: "https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=600&q=80" }
    ],
    subtotal: 6400,
    shippingFee: 350,
    total: 6750,
    status: "Shipped"
  },
  {
    id: "ORD-1003",
    customerId: "USR-1004",
    customerName: "Kavindi Senanayake",
    email: "kavindi@gmail.com",
    phone: "+94 70 334 5566",
    date: "2026-10-07",
    deliveryAddress: "24 Peradeniya Road, Kandy",
    notes: "Gift wrap requested.",
    items: [
      { bookId: "BK-1008", title: "Sapiens: A Brief History of Humankind", price: 4100, quantity: 1, cover: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80" },
      { bookId: "BK-1004", title: "Rich Dad Poor Dad", price: 2900, quantity: 2, cover: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=600&q=80" }
    ],
    subtotal: 9900,
    shippingFee: 350,
    total: 10250,
    status: "Processing"
  },
  {
    id: "ORD-1004",
    customerId: "USR-1002",
    customerName: "Amaya Fernando",
    email: "amaya@gmail.com",
    phone: "+94 71 987 6543",
    date: "2026-10-08",
    deliveryAddress: "45 Galle Road, Mount Lavinia",
    notes: "Deliver during office hours.",
    items: [
      { bookId: "BK-1006", title: "Introduction to Algorithms", price: 8900, quantity: 1, cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80" }
    ],
    subtotal: 8900,
    shippingFee: 350,
    total: 9250,
    status: "Pending"
  },
  {
    id: "ORD-1005",
    customerId: "USR-1003",
    customerName: "Dilshan Silva",
    email: "dilshan@yahoo.com",
    phone: "+94 76 543 2109",
    date: "2026-09-28",
    deliveryAddress: "15 Temple Road, Negombo",
    notes: "Cancelled by customer request.",
    items: [
      { bookId: "BK-1009", title: "The Da Vinci Code", price: 2650, quantity: 1, cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80" }
    ],
    subtotal: 2650,
    shippingFee: 350,
    total: 3000,
    status: "Cancelled"
  }
];

const INITIAL_REVIEWS = [
  {
    id: "REV-1001",
    bookId: "BK-1003",
    bookTitle: "Atomic Habits",
    customerName: "Amaya Fernando",
    rating: 5,
    comment: "A truly life-changing read! The practical step-by-step guidance on habit stacking and 1% improvements works wonders.",
    date: "2026-10-03"
  },
  {
    id: "REV-1002",
    bookId: "BK-1005",
    bookTitle: "Clean Code",
    customerName: "Dilshan Silva",
    rating: 5,
    comment: "Essential reading for every software engineering student. Explains meaningful names, function length, and refactoring with clarity.",
    date: "2026-10-06"
  },
  {
    id: "REV-1003",
    bookId: "BK-1001",
    bookTitle: "Harry Potter and the Philosopher's Stone",
    customerName: "Kavindi Senanayake",
    rating: 5,
    comment: "Timeless classic! The book arrived in pristine condition and was well packed.",
    date: "2026-10-04"
  },
  {
    id: "REV-1004",
    bookId: "BK-1004",
    bookTitle: "Rich Dad Poor Dad",
    customerName: "Nuwan Bandara",
    rating: 4,
    comment: "Very insightful perspective on financial literacy and understanding real assets.",
    date: "2026-10-01"
  },
  {
    id: "REV-1005",
    bookId: "BK-1008",
    bookTitle: "Sapiens: A Brief History of Humankind",
    customerName: "Amaya Fernando",
    rating: 5,
    comment: "Mind-expanding exploration of how human cooperation, myths, and cognitive shifts shaped the world.",
    date: "2026-10-08"
  }
];

/**
 * Storage Engine Class — Centralizes Local Storage Access
 * Can be straightforwardly adapted to call Java REST Controllers:
 * e.g., replacing localStorage with fetch('http://localhost:8080/api/books')
 */
class BookNestStore {
  // Spring Boot Java Backend API Endpoint
  static API_BASE = "http://localhost:8080/api";
  static isBackendOnline = false;

  // Key names in browser localStorage
  static KEYS = {
    BOOKS: "booknest_books_se1020",
    CATEGORIES: "booknest_categories_se1020",
    USERS: "booknest_users_se1020",
    ORDERS: "booknest_orders_se1020",
    REVIEWS: "booknest_reviews_se1020",
    CART: "booknest_cart_se1020",
    CURRENT_USER: "booknest_curr_user_se1020"
  };

  /**
   * Pings the Spring Boot backend /api/health endpoint.
   * Returns true if backend is online, false otherwise.
   */
  static async checkBackendHealth() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${this.API_BASE}/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      this.isBackendOnline = res.ok;
      return res.ok;
    } catch (e) {
      this.isBackendOnline = false;
      return false;
    }
  }

  /**
   * Safely synchronizes backend text-file data into localStorage on startup.
   * Only updates localStorage if the backend is validated and online,
   * without touching active user sessions or cart.
   */
  static async syncFromBackend() {
    try {
      const online = await this.checkBackendHealth();
      if (!online) {
        console.info("[BookNest] Backend offline. Running in LocalStorage-only mode.");
        return false;
      }

      // Fetch all collections in parallel
      const [booksRes, catsRes, usersRes, ordersRes, reviewsRes] = await Promise.allSettled([
        fetch(`${this.API_BASE}/books`).then(r => r.ok ? r.json() : null),
        fetch(`${this.API_BASE}/categories`).then(r => r.ok ? r.json() : null),
        fetch(`${this.API_BASE}/users`).then(r => r.ok ? r.json() : null),
        fetch(`${this.API_BASE}/orders`).then(r => r.ok ? r.json() : null),
        fetch(`${this.API_BASE}/reviews`).then(r => r.ok ? r.json() : null)
      ]);

      // Only update if response is a valid, non-empty array (Requirement 3)
      if (booksRes.status === "fulfilled" && Array.isArray(booksRes.value) && booksRes.value.length > 0) {
        localStorage.setItem(this.KEYS.BOOKS, JSON.stringify(booksRes.value));
      }
      if (catsRes.status === "fulfilled" && Array.isArray(catsRes.value) && catsRes.value.length > 0) {
        localStorage.setItem(this.KEYS.CATEGORIES, JSON.stringify(catsRes.value));
      }
      if (usersRes.status === "fulfilled" && Array.isArray(usersRes.value) && usersRes.value.length > 0) {
        localStorage.setItem(this.KEYS.USERS, JSON.stringify(usersRes.value));
      }
      if (ordersRes.status === "fulfilled" && Array.isArray(ordersRes.value) && ordersRes.value.length > 0) {
        localStorage.setItem(this.KEYS.ORDERS, JSON.stringify(ordersRes.value));
      }
      if (reviewsRes.status === "fulfilled" && Array.isArray(reviewsRes.value) && reviewsRes.value.length > 0) {
        localStorage.setItem(this.KEYS.REVIEWS, JSON.stringify(reviewsRes.value));
      }

      console.info("[BookNest] Successfully connected to Java backend. Persistent text storage active.");
      return true;
    } catch (err) {
      console.warn("[BookNest] Backend sync encountered an issue, preserving LocalStorage:", err);
      return false;
    }
  }

  /**
   * Helper to send asynchronous write operations (POST, PUT, DELETE, PATCH) to the backend.
   * Handles errors without breaking local user workflows.
   */
  static async sendToBackend(endpoint, method = "GET", data = null) {
    try {
      const isUp = this.isBackendOnline || await this.checkBackendHealth();
      if (!isUp) return null;

      const options = {
        method: method,
        headers: { "Content-Type": "application/json" }
      };
      if (data && method !== "GET" && method !== "DELETE") {
        options.body = JSON.stringify(data);
      }

      const res = await fetch(`${this.API_BASE}${endpoint}`, options);
      if (!res.ok) {
        console.warn(`[BookNest API] ${method} ${endpoint} returned HTTP ${res.status}`);
        return null;
      }
      return res.status !== 204 ? await res.json() : true;
    } catch (e) {
      console.warn(`[BookNest API Error] ${method} ${endpoint} failed:`, e.message);
      return null;
    }
  }

  /**
   * Initializes local storage with seed data if not previously initialized
   */
  static init() {
    if (!localStorage.getItem(this.KEYS.BOOKS)) {
      localStorage.setItem(this.KEYS.BOOKS, JSON.stringify(INITIAL_BOOKS));
    }
    if (!localStorage.getItem(this.KEYS.CATEGORIES)) {
      localStorage.setItem(this.KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    }
    if (!localStorage.getItem(this.KEYS.USERS)) {
      localStorage.setItem(this.KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(this.KEYS.ORDERS)) {
      localStorage.setItem(this.KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    }
    if (!localStorage.getItem(this.KEYS.REVIEWS)) {
      localStorage.setItem(this.KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
    }
    if (!localStorage.getItem(this.KEYS.CART)) {
      localStorage.setItem(this.KEYS.CART, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.KEYS.CURRENT_USER)) {
    // No default user — visitors start as guests
    localStorage.removeItem(this.KEYS.CURRENT_USER);
  }
}

  // ================= BOOKS CRUD =================
  static getBooks() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.BOOKS)) || [];
    } catch (e) {
      return INITIAL_BOOKS;
    }
  }

  static getBookById(id) {
    const books = this.getBooks();
    return books.find(b => b.id === id) || null;
  }

  static saveBook(book) {
    const books = this.getBooks();
    const existingIndex = books.findIndex(b => b.id === book.id);
    const isUpdate = existingIndex >= 0;
    if (isUpdate) {
      books[existingIndex] = { ...books[existingIndex], ...book };
    } else {
      books.unshift(book);
    }
    localStorage.setItem(this.KEYS.BOOKS, JSON.stringify(books));

    // Asynchronously synchronize with backend text files
    if (isUpdate) {
      this.sendToBackend(`/books/${encodeURIComponent(book.id)}`, "PUT", book);
    } else {
      this.sendToBackend("/books", "POST", book);
    }
    return book;
  }

  static deleteBook(id) {
    let books = this.getBooks();
    books = books.filter(b => b.id !== id);
    localStorage.setItem(this.KEYS.BOOKS, JSON.stringify(books));
    this.sendToBackend(`/books/${encodeURIComponent(id)}`, "DELETE");
    return true;
  }

  // ================= CATEGORIES CRUD =================
  static getCategories() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.CATEGORIES)) || [];
    } catch (e) {
      return INITIAL_CATEGORIES;
    }
  }

  static getCategoryById(id) {
    return this.getCategories().find(c => c.id === id) || null;
  }

  static saveCategory(category) {
    const categories = this.getCategories();
    const index = categories.findIndex(c => c.id === category.id);
    const isUpdate = index >= 0;
    if (isUpdate) {
      categories[index] = { ...categories[index], ...category };
    } else {
      categories.push(category);
    }
    localStorage.setItem(this.KEYS.CATEGORIES, JSON.stringify(categories));

    if (isUpdate) {
      this.sendToBackend(`/categories/${encodeURIComponent(category.id)}`, "PUT", category);
    } else {
      this.sendToBackend("/categories", "POST", category);
    }
    return category;
  }

  static deleteCategory(id) {
    let categories = this.getCategories();
    categories = categories.filter(c => c.id !== id);
    localStorage.setItem(this.KEYS.CATEGORIES, JSON.stringify(categories));
    this.sendToBackend(`/categories/${encodeURIComponent(id)}`, "DELETE");
    return true;
  }

  // ================= USERS CRUD =================
  static getUsers() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.USERS)) || [];
    } catch (e) {
      return INITIAL_USERS;
    }
  }

  static getUserById(id) {
    return this.getUsers().find(u => u.id === id) || null;
  }

  static saveUser(user) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    const isUpdate = index >= 0;
    if (isUpdate) {
      users[index] = { ...users[index], ...user };
    } else {
      users.push(user);
    }
    localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));

    if (isUpdate) {
      this.sendToBackend(`/users/${encodeURIComponent(user.id)}`, "PUT", user);
    } else {
      this.sendToBackend("/users", "POST", user);
    }
    return user;
  }

  static deleteUser(id) {
    let users = this.getUsers();
    users = users.filter(u => u.id !== id);
    localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
    this.sendToBackend(`/users/${encodeURIComponent(id)}`, "DELETE");
    return true;
  }

  // ================= ORDERS CRUD =================
  static getOrders() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.ORDERS)) || [];
    } catch (e) {
      return INITIAL_ORDERS;
    }
  }

  static getOrderById(id) {
    return this.getOrders().find(o => o.id === id) || null;
  }

  static saveOrder(order) {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === order.id);
    if (index >= 0) {
      orders[index] = { ...orders[index], ...order };
    } else {
      orders.unshift(order);
    }
    localStorage.setItem(this.KEYS.ORDERS, JSON.stringify(orders));

    // Also deduct stock locally so immediate UI re-renders show reduced book quantity
    if (order.items && Array.isArray(order.items)) {
      const books = this.getBooks();
      order.items.forEach(item => {
        const b = books.find(x => x.id === item.bookId);
        if (b && b.quantity >= item.quantity) {
          b.quantity -= item.quantity;
        }
      });
      localStorage.setItem(this.KEYS.BOOKS, JSON.stringify(books));
    }

    // Backend order controller creates order and reduces stock in books.txt
    this.sendToBackend("/orders", "POST", order);
    return order;
  }

  static updateOrderStatus(id, newStatus) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === id);
    if (order) {
      order.status = newStatus;
      localStorage.setItem(this.KEYS.ORDERS, JSON.stringify(orders));
      this.sendToBackend(`/orders/${encodeURIComponent(id)}/status`, "PATCH", { status: newStatus });
      return order;
    }
    return null;
  }

  static deleteOrder(id) {
    let orders = this.getOrders();
    orders = orders.filter(o => o.id !== id);
    localStorage.setItem(this.KEYS.ORDERS, JSON.stringify(orders));
    this.sendToBackend(`/orders/${encodeURIComponent(id)}`, "DELETE");
    return true;
  }

  // ================= REVIEWS CRUD =================
  static getReviews() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.REVIEWS)) || [];
    } catch (e) {
      return INITIAL_REVIEWS;
    }
  }

  static getReviewsByBookId(bookId) {
    return this.getReviews().filter(r => r.bookId === bookId);
  }

  static saveReview(review) {
    const reviews = this.getReviews();
    const index = reviews.findIndex(r => r.id === review.id);
    if (index >= 0) {
      reviews[index] = { ...reviews[index], ...review };
    } else {
      reviews.unshift(review);
    }
    localStorage.setItem(this.KEYS.REVIEWS, JSON.stringify(reviews));
    this.sendToBackend("/reviews", "POST", review);
    return review;
  }

  static deleteReview(id) {
    let reviews = this.getReviews();
    reviews = reviews.filter(r => r.id !== id);
    localStorage.setItem(this.KEYS.REVIEWS, JSON.stringify(reviews));
    this.sendToBackend(`/reviews/${encodeURIComponent(id)}`, "DELETE");
    return true;
  }

  // ================= SHOPPING CART =================
  static getCart() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.CART)) || [];
    } catch (e) {
      return [];
    }
  }

  static saveCart(cart) {
    localStorage.setItem(this.KEYS.CART, JSON.stringify(cart));
    this.dispatchCartUpdate();
  }

  static addToCart(bookId, quantity = 1) {
    const cart = this.getCart();
    const book = this.getBookById(bookId);
    if (!book) return { success: false, message: "Book not found" };

    const itemIndex = cart.findIndex(item => item.bookId === bookId);
    if (itemIndex > -1) {
      cart[itemIndex].quantity += quantity;
      if (cart[itemIndex].quantity > book.quantity) {
        cart[itemIndex].quantity = book.quantity;
      }
    } else {
      cart.push({
        bookId: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        cover: book.cover,
        category: book.category,
        quantity: Math.min(quantity, book.quantity),
        maxQuantity: book.quantity
      });
    }

    this.saveCart(cart);
    return { success: true, cartCount: this.getCartCount(), message: `Added "${book.title}" to cart!` };
  }

  static updateCartQuantity(bookId, newQuantity) {
    let cart = this.getCart();
    if (newQuantity <= 0) {
      return this.removeFromCart(bookId);
    }
    const item = cart.find(i => i.bookId === bookId);
    if (item) {
      const book = this.getBookById(bookId);
      const max = book ? book.quantity : 99;
      item.quantity = Math.min(newQuantity, max);
      this.saveCart(cart);
    }
    return cart;
  }

  static removeFromCart(bookId) {
    let cart = this.getCart();
    cart = cart.filter(i => i.bookId !== bookId);
    this.saveCart(cart);
    return cart;
  }

  static clearCart() {
    this.saveCart([]);
  }

  static getCartCount() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.quantity || 0), 0);
  }

  static getCartSubtotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  static dispatchCartUpdate() {
    window.dispatchEvent(new CustomEvent("booknest:cartUpdated", {
      detail: { count: this.getCartCount(), subtotal: this.getCartSubtotal() }
    }));
  }

  // ================= CURRENT AUTH USER =================
  static getCurrentUser() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.CURRENT_USER));
    } catch (e) {
      return null;
    }
  }

  static setCurrentUser(user) {
    localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(user));
  }
  
  
  static logout() {
    localStorage.removeItem(this.KEYS.CURRENT_USER);

    // Clear the cart when the user logs out
    this.clearCart();

    // Update the cart badge
    this.dispatchCartUpdate();
  }


  

  // Direct async API interface for viva demonstration & automated testing
  static api = {
    async health() {
      const res = await fetch(`${BookNestStore.API_BASE}/health`);
      return await res.json();
    },
    async getBooks() {
      const res = await fetch(`${BookNestStore.API_BASE}/books`);
      return await res.json();
    },
    async saveBook(book) {
      const method = book.id && BookNestStore.getBookById(book.id) ? "PUT" : "POST";
      const url = method === "PUT" ? `${BookNestStore.API_BASE}/books/${encodeURIComponent(book.id)}` : `${BookNestStore.API_BASE}/books`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book)
      });
      return await res.json();
    },
    async deleteBook(id) {
      return await fetch(`${BookNestStore.API_BASE}/books/${encodeURIComponent(id)}`, { method: "DELETE" });
    },
    async getCategories() {
      const res = await fetch(`${BookNestStore.API_BASE}/categories`);
      return await res.json();
    },
    async getUsers() {
      const res = await fetch(`${BookNestStore.API_BASE}/users`);
      return await res.json();
    },
    async getOrders() {
      const res = await fetch(`${BookNestStore.API_BASE}/orders`);
      return await res.json();
    },
    async createOrder(order) {
      const res = await fetch(`${BookNestStore.API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
      });
      return await res.json();
    },
    async getReviews(bookId) {
      const url = bookId ? `${BookNestStore.API_BASE}/reviews?bookId=${encodeURIComponent(bookId)}` : `${BookNestStore.API_BASE}/reviews`;
      const res = await fetch(url);
      return await res.json();
    }
  };

  // ================= RESET TO DEFAULTS =================
  static resetToDefault() {
    localStorage.removeItem(this.KEYS.BOOKS);
    localStorage.removeItem(this.KEYS.CATEGORIES);
    localStorage.removeItem(this.KEYS.USERS);
    localStorage.removeItem(this.KEYS.ORDERS);
    localStorage.removeItem(this.KEYS.REVIEWS);
    localStorage.removeItem(this.KEYS.CART);
    localStorage.removeItem(this.KEYS.CURRENT_USER);
    this.init();
  }
}

// Global utility formatting helpers
const UIUtils = {
  formatPrice(amount) {
    return "LKR " + Number(amount || 0).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  },

  renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.4;
    let html = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        html += '<i class="bi bi-star-fill text-warning"></i>';
      } else if (i === fullStars + 1 && hasHalf) {
        html += '<i class="bi bi-star-half text-warning"></i>';
      } else {
        html += '<i class="bi bi-star text-muted"></i>';
      }
    }
    return html;
  },

  getStatusBadge(status) {
    const map = {
      Pending: "bg-warning text-dark",
      Processing: "bg-info text-dark",
      Shipped: "bg-primary text-white",
      Delivered: "bg-success text-white",
      Cancelled: "bg-danger text-white",
      Active: "bg-success text-white",
      Suspended: "bg-secondary text-white",
      Admin: "bg-dark text-white",
      Customer: "bg-info text-dark",
      Staff: "bg-secondary text-white"
    };
    const badgeClass = map[status] || "bg-secondary text-white";
    return `<span class="badge ${badgeClass} px-2 py-1">${status}</span>`;
  },

  // Fallback book cover if an external image link fails to load
  getFallbackCoverSvg(title, author) {
    const cleanTitle = (title || "Book").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const cleanAuthor = (author || "Author").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420">
        <defs>
          <linearGradient id="bookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0f2b48" />
            <stop offset="100%" stop-color="#1e3a5f" />
          </linearGradient>
        </defs>
        <rect width="300" height="420" rx="8" fill="url(#bookGrad)"/>
        <rect x="15" y="15" width="270" height="390" rx="4" fill="none" stroke="#e2e8f0" stroke-width="1.5" stroke-opacity="0.3"/>
        <circle cx="150" cy="130" r="45" fill="#2563eb" fill-opacity="0.2"/>
        <path d="M130 115 H170 V155 H130 Z" fill="none" stroke="#60a5fa" stroke-width="3"/>
        <text x="150" y="210" fill="#ffffff" font-family="'Inter', sans-serif" font-size="16" font-weight="bold" text-anchor="middle">
          ${cleanTitle.length > 25 ? cleanTitle.substring(0, 22) + "..." : cleanTitle}
        </text>
        <text x="150" y="235" fill="#93c5fd" font-family="'Inter', sans-serif" font-size="13" text-anchor="middle">
          by ${cleanAuthor.length > 28 ? cleanAuthor.substring(0, 25) + "..." : cleanAuthor}
        </text>
        <text x="150" y="375" fill="#64748b" font-family="'Inter', sans-serif" font-size="11" letter-spacing="2" text-anchor="middle">
          BOOKNEST LIBRARY
        </text>
      </svg>
    `;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  },

  showToast(message, type = "success") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container position-fixed bottom-0 end-0 p-3";
      container.style.zIndex = "9999";
      document.body.appendChild(container);
    }

    const toastId = "toast-" + Date.now();
    const iconClass = type === "success" ? "bi-check-circle-fill text-success" :
                      type === "danger" ? "bi-exclamation-triangle-fill text-danger" :
                      type === "info" ? "bi-info-circle-fill text-info" : "bi-bell-fill text-warning";
    const headerTitle = type === "success" ? "Success" :
                        type === "danger" ? "Error" :
                        type === "info" ? "Information" : "Notice";

    const toastHtml = `
      <div id="${toastId}" class="toast align-items-center shadow-lg border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header bg-white border-bottom-0">
          <i class="bi ${iconClass} me-2 fs-5"></i>
          <strong class="me-auto text-dark">${headerTitle}</strong>
          <small class="text-muted">Just now</small>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body pt-0 text-secondary">
          ${message}
        </div>
      </div>
    `;

    container.insertAdjacentHTML("beforeend", toastHtml);
    const toastEl = document.getElementById(toastId);
    if (window.bootstrap && bootstrap.Toast) {
      const bsToast = new bootstrap.Toast(toastEl, { delay: 3500 });
      bsToast.show();
      toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
    } else {
      toastEl.classList.add("show");
      setTimeout(() => toastEl.remove(), 3500);
    }
  }
};

// Initialize data storage automatically on load
BookNestStore.init();
BookNestStore.syncFromBackend();
