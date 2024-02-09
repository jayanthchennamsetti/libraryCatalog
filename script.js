    // Define the Book class
    var isAdmin = localStorage.getItem("isAdmin") === "true";
    const loggedInUserId = localStorage.getItem("loggedInUserId");
    class Book {
        constructor(title, author, isbn, genre, availability = true) {
            this.title = title;
            this.author = author;
            this.isbn = isbn;
            this.genre = genre;
            this.availability = availability;
        }
    }

    // Define the LibraryCatalog class
    class LibraryCatalog {
        constructor() {
            this.books = JSON.parse(localStorage.getItem('libraryCatalog')) || [];
        }

        // Method to add a book to the catalog
addBook(book) {
    // Check if the book has all the required properties
    if (!book.title || !book.author || !book.isbn || !book.genre || book.quantity === undefined) {
        console.error("Book is missing required properties.");
        return;
    }

    this.books.push(book);
    this.updateLocalStorage();
    this.displayBooks();
}


        // Method to remove a book from the catalog
        removeBook(isbn) {
            this.books = this.books.filter(book => book.isbn !== isbn);
            this.updateLocalStorage();
            this.displayBooks();
        }

        // Method to update local storage with the current book catalog
        updateLocalStorage() {
            localStorage.setItem('libraryCatalog', JSON.stringify(this.books));
        }

        // Method to display all books in the catalog
        // Method to display all books in the catalog
    displayBooks(books = this.books) {
        const bookList = document.getElementById("book-list");
        bookList.innerHTML = '';
        books.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.classList.add('book-item');
            bookItem.innerHTML = `
            <div class="book-image">
            <img src="${book.image}" alt="${book.title} Image shows here">
        </div>
                <p><strong>Title:</strong> ${book.title}</p>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Genre:</strong> ${book.genre}</p>
                <p><strong>ISBN:</strong>${book.isbn}</p>
                <p><strong>Books Left:</strong> ${book.quantity}</p>
                ${isAdmin ? `<button onclick="removeBook('${book.isbn}')">Remove</button>` : ''}
                ${isAdmin ? `<button onclick="showBookDetails('${book.isbn}')">Details</button>` : ''}
                ${!isAdmin ? `<button onclick="checkoutBook('${book.isbn}')">Checkout</button>` : ''}
            `;
            bookList.appendChild(bookItem);
        });
    }
    

        // Method to search for books by title, author, or genre
        searchBooks(keyword) {
            const filteredBooks = this.books.filter(book =>
                book.title.toLowerCase().includes(keyword.toLowerCase()) ||
                book.author.toLowerCase().includes(keyword.toLowerCase()) ||
                book.genre.toLowerCase().includes(keyword.toLowerCase())
            );
            this.displayBooks(filteredBooks);
        }

        // Method to display book details
        displayBookDetails(isbn) {
            const book = this.books.find(book => book.isbn === isbn);
            if (book) {
                alert(`Title: ${book.title}\nAuthor: ${book.author}\nISBN: ${book.isbn}\nGenre: ${book.genre}\nAvailability: ${book.availability ? 'Available' : 'Not Available'}`);
            } else {
                alert('Book not found.');
            }
        }

        // Method to checkout a book
checkoutBook(isbn) {
    
    if (!loggedInUserId) {
        alert("Please log in to perform checkout.");
        window.location.href = "login.html";
        return;
    }

    const book = this.books.find(book => book.isbn === isbn);
    if (book) {
        // Check if quantity is greater than 0
        if (book.quantity > 0) {
            // Decrease quantity
            book.quantity--;
            // Update availability based on quantity
            book.availability = book.quantity > 0;
            // Update the availability in the libraryCatalog
            this.updateAvailability(isbn, book.availability);
            // Update the libraryCatalog in local storage
            this.updateLocalStorage();
            this.displayBooks();
            alert(`Book "${book.title}" has been checked out successfully  `);
            
            // Add the checked-out book to the user's cart
            let userCart = JSON.parse(localStorage.getItem("userCart_" + loggedInUserId)) || [];
            userCart.push(book);
            localStorage.setItem("userCart_" + loggedInUserId, JSON.stringify(userCart));
        } else {
            alert('Book is out of stock.');
        }
    } else {
        alert('Book not found.');
    }
}

        
        // Method to update availability in libraryCatalog
        updateAvailability(isbn, availability) {
            const book = this.books.find(book => book.isbn === isbn);
            if (book) {
                book.availability = availability;
            }
        }
        


    }

    // Function to remove a book
    function removeBook(isbn) {
        libraryCatalog.removeBook(isbn);
    }

    // Function to show book details
    function showBookDetails(isbn) {
        libraryCatalog.displayBookDetails(isbn);
    }

    // Function to checkout a book
    function checkoutBook(isbn) {
        libraryCatalog.checkoutBook(isbn);
    }

    // Function to return a book
    function returnBook(isbn) {
        libraryCatalog.returnBook(isbn);
    }

    // Create an instance of the LibraryCatalog class
    const libraryCatalog = new LibraryCatalog();

    // Display existing books
    libraryCatalog.displayBooks();

    // Event listener for searching books
    document.getElementById('search').addEventListener('input', function() {
        libraryCatalog.searchBooks(this.value);
    });
    function redirectToPage() {
        // Change the URL to the desired page
        window.location.href = 'updateBookDetails.html';
    }