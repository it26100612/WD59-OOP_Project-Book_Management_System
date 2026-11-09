package com.booknest.dao;

import com.booknest.model.Book;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
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
 * BookFileDAO
 * Handles persistent CRUD operations for Books using text-file read/write.
 * Implements GenericDAO interface (Polymorphism & Abstraction).
 */
@Repository
public class BookFileDAO implements GenericDAO<Book, String> {
    private final File dataFile;
    private final ObjectMapper objectMapper;

    public BookFileDAO(@Value("${booknest.data.dir:./data}") String dataDir) {
        File dir = new File(dataDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        this.dataFile = new File(dir, "books.txt");
        this.objectMapper = new ObjectMapper()
                .enable(SerializationFeature.INDENT_OUTPUT)
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        initFileWithSeedData();
    }

    private synchronized void initFileWithSeedData() {
        if (!dataFile.exists() || dataFile.length() == 0) {
            List<Book> initialBooks = createDefaultBooks();
            writeAll(initialBooks);
        }
    }

    private synchronized List<Book> readAll() {
        if (!dataFile.exists() || dataFile.length() == 0) {
            return new ArrayList<>();
        }
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(dataFile), StandardCharsets.UTF_8))) {
            return objectMapper.readValue(reader, new TypeReference<List<Book>>() {});
        } catch (IOException e) {
            System.err.println("Error reading books.txt: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    private synchronized void writeAll(List<Book> books) {
        try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(dataFile), StandardCharsets.UTF_8))) {
            objectMapper.writeValue(writer, books);
        } catch (IOException e) {
            System.err.println("Error writing books.txt: " + e.getMessage());
        }
    }

    @Override
    public List<Book> findAll() {
        return readAll();
    }

    @Override
    public Optional<Book> findById(String id) {
        return readAll().stream()
                .filter(b -> b.getId().equalsIgnoreCase(id))
                .findFirst();
    }

    @Override
    public synchronized Book save(Book book) {
        List<Book> books = readAll();
        boolean updated = false;

        for (int i = 0; i < books.size(); i++) {
            if (books.get(i).getId().equalsIgnoreCase(book.getId())) {
                books.set(i, book);
                updated = true;
                break;
            }
        }

        if (!updated) {
            if (book.getId() == null || book.getId().trim().isEmpty()) {
                book.setId("BK-" + (System.currentTimeMillis() % 10000));
            }
            books.add(book);
        }

        writeAll(books);
        return book;
    }

    @Override
    public synchronized boolean deleteById(String id) {
        List<Book> books = readAll();
        boolean removed = books.removeIf(b -> b.getId().equalsIgnoreCase(id));
        if (removed) {
            writeAll(books);
        }
        return removed;
    }

    private List<Book> createDefaultBooks() {
        List<Book> list = new ArrayList<>();

        Book b1 = new Book("BK-1001", "Harry Potter and the Philosopher's Stone", "J.K. Rowling", "Fiction", "978-0747532743", 2850, 24);
        b1.setCover("https://images.unsplash.com/photo-1618666012174-83b441c0bc76?auto=format&fit=crop&w=600&q=80");
        b1.setDescription("Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive.");
        b1.setPublisher("Bloomsbury Publishing");
        b1.setPublishedYear(1997);
        b1.setPages(223);
        b1.setRating(4.9);
        b1.setReviewsCount(38);
        list.add(b1);

        Book b2 = new Book("BK-1002", "The Hobbit", "J.R.R. Tolkien", "Fiction", "978-0261102217", 3200, 18);
        b2.setCover("https://images.unsplash.com/photo-1629992101753-56d196c8aabb?auto=format&fit=crop&w=600&q=80");
        b2.setDescription("Whisked away from his comfortable life in Hobbiton by Gandalf, Bilbo Baggins finds himself in an epic quest.");
        b2.setPublisher("HarperCollins");
        b2.setPublishedYear(1937);
        b2.setPages(310);
        b2.setRating(4.8);
        b2.setReviewsCount(29);
        list.add(b2);

        Book b3 = new Book("BK-1003", "Atomic Habits", "James Clear", "Personal Development", "978-0735211292", 3750, 45);
        b3.setCover("https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80");
        b3.setDescription("Atomic Habits offers a proven framework for improving every day with 1% compounding shifts.");
        b3.setPublisher("Avery / Penguin Random House");
        b3.setPublishedYear(2018);
        b3.setPages(320);
        b3.setRating(4.9);
        b3.setReviewsCount(64);
        list.add(b3);

        Book b4 = new Book("BK-1004", "Rich Dad Poor Dad", "Robert Kiyosaki", "Personal Development", "978-1612680194", 2900, 32);
        b4.setCover("https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=600&q=80");
        b4.setDescription("Rich Dad Poor Dad explodes the myth that you need to earn a high income to become rich.");
        b4.setPublisher("Plata Publishing");
        b4.setPublishedYear(1997);
        b4.setPages(336);
        b4.setRating(4.7);
        b4.setReviewsCount(52);
        list.add(b4);

        Book b5 = new Book("BK-1005", "Clean Code: A Handbook of Agile Software Craftsmanship", "Robert C. Martin", "Technology", "978-0132350884", 6400, 15);
        b5.setCover("https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=600&q=80");
        b5.setDescription("Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.");
        b5.setPublisher("Prentice Hall");
        b5.setPublishedYear(2008);
        b5.setPages(464);
        b5.setRating(4.9);
        b5.setReviewsCount(41);
        list.add(b5);

        Book b6 = new Book("BK-1006", "Introduction to Algorithms", "Thomas H. Cormen", "Education", "978-0262033848", 8900, 10);
        b6.setCover("https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80");
        b6.setDescription("Some books on algorithms are rigorous but incomplete; others cover masses of material but lack rigor.");
        b6.setPublisher("MIT Press");
        b6.setPublishedYear(2009);
        b6.setPages(1292);
        b6.setRating(4.8);
        b6.setReviewsCount(19);
        list.add(b6);

        Book b7 = new Book("BK-1007", "A Brief History of Time", "Stephen Hawking", "Science", "978-0553380163", 3100, 22);
        b7.setCover("https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80");
        b7.setDescription("Hawking explores profound questions about the universe: How did it begin? Is time travel possible?");
        b7.setPublisher("Bantam Books");
        b7.setPublishedYear(1988);
        b7.setPages(256);
        b7.setRating(4.7);
        b7.setReviewsCount(35);
        list.add(b7);

        Book b8 = new Book("BK-1008", "Sapiens: A Brief History of Humankind", "Yuval Noah Harari", "Science", "978-0062316097", 4100, 26);
        b8.setCover("https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80");
        b8.setDescription("Yuval Noah Harari spans the whole of human history, from early ancestors to artificial intelligence.");
        b8.setPublisher("Harper");
        b8.setPublishedYear(2014);
        b8.setPages(443);
        b8.setRating(4.8);
        b8.setReviewsCount(47);
        list.add(b8);

        Book b9 = new Book("BK-1009", "The Da Vinci Code", "Dan Brown", "Mystery", "978-0307474278", 2650, 20);
        b9.setCover("https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80");
        b9.setDescription("While in Paris, Robert Langdon is awakened by a phone call: the curator of the Louvre has been murdered.");
        b9.setPublisher("Anchor Books");
        b9.setPublishedYear(2003);
        b9.setPages(489);
        b9.setRating(4.6);
        b9.setReviewsCount(31);
        list.add(b9);

        Book b10 = new Book("BK-1010", "Sherlock Holmes: The Complete Novels and Stories", "Sir Arthur Conan Doyle", "Mystery", "978-0553212419", 3950, 12);
        b10.setCover("https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=600&q=80");
        b10.setDescription("Detective Sherlock Holmes has fascinated millions with his brilliant deductive reasoning.");
        b10.setPublisher("Bantam Classics");
        b10.setPublishedYear(1986);
        b10.setPages(832);
        b10.setRating(4.9);
        b10.setReviewsCount(28);
        list.add(b10);

        return list;
    }
}
