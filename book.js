const newBookBtn = document.getElementById('newBookBtn');
const newBookFormContainer = document.getElementById('new-book');
const addBookForm = document.getElementById('addBookForm');
const booksContainer = document.getElementById('Books');
const searchDiv = document.getElementById('Search');

let editingId = null;

const searchInput = document.createElement('input');
searchInput.type = 'text';
searchInput.placeholder = 'Search by title or author...';
searchDiv.appendChild(searchInput);

window.addEventListener('DOMContentLoaded', displayBooks);

newBookBtn.addEventListener('click', () => {
    toggleForm();
});

function toggleForm() {
    const isHidden = newBookFormContainer.style.display === 'none' || newBookFormContainer.style.display === '';
    newBookFormContainer.style.display = isHidden ? 'grid' : 'none';
    if (isHidden && !editingId) {
        addBookForm.reset();
        document.querySelector('#addBookForm input[type="submit"]').value = 'Add Book';
    }
}
searchInput.addEventListener('keyup', () => {
    const filter = searchInput.value.toLowerCase();
    const books = document.querySelectorAll('.Book');
    books.forEach(book => {
        const text = book.innerText.toLowerCase();
        book.style.display = text.includes(filter) ? '' : 'none';
    });
});

addBookForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('TITLE').value;
    const author = document.getElementById('AUTHOR').value;
    const genre = document.getElementById('GENRE').value;
    const date = document.getElementById('Production-Date').value;

    if (editingId) {
        let books = getBooks();
        const index = books.findIndex(b => b.id === editingId);
        if (index !== -1) {
            books[index] = { id: editingId, title, author, genre, date };
            localStorage.setItem('nexus_library', JSON.stringify(books));
            showToast("Book updated successfully!");
        }
        editingId = null;
    } else {
        // ADD NEW
        const book = { id: Date.now(), title, author, genre, date };
        saveBook(book);
        showToast("Book added to library!");
    }

    addBookForm.reset();
    newBookFormContainer.style.display = 'none';
    refreshUI();
});

function createBookCard(book) {
    const bookDiv = document.createElement('div');
    bookDiv.classList.add('Book');
    bookDiv.setAttribute('data-id', book.id);

    bookDiv.innerHTML = `
        <p class="text">
            <strong>${book.title}</strong><br>
            ${book.author}<br>
            <i>${book.genre}</i><br>
            <small>${book.date}</small>
        </p>
        <div class="icon-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="edit-icon" onclick="editBook(${book.id})">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="delete-icon" onclick="deleteBook(${book.id})">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
        </div>
    `;
    booksContainer.prepend(bookDiv);
}

window.editBook = function(id) {
    const books = getBooks();
    const book = books.find(b => b.id === id);
    if (book) {
        document.getElementById('TITLE').value = book.title;
        document.getElementById('AUTHOR').value = book.author;
        document.getElementById('GENRE').value = book.genre;
        document.getElementById('Production-Date').value = book.date;
        
        editingId = id;
        newBookFormContainer.style.display = 'grid';
        document.querySelector('#addBookForm input[type="submit"]').value = 'Update Book';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

window.deleteBook = function(id) {
    if (confirm("Remove this book from your Nexus Library?")) {
        let books = getBooks();
        books = books.filter(b => b.id !== id);
        localStorage.setItem('nexus_library', JSON.stringify(books));
        
        const el = document.querySelector(`[data-id="${id}"]`);
        el.style.transform = 'scale(0)';
        setTimeout(() => {
            refreshUI();
            showToast("Book deleted.");
        }, 300);
    }
};

function saveBook(book) {
    const books = getBooks();
    books.push(book);
    localStorage.setItem('nexus_library', JSON.stringify(books));
}

function getBooks() {
    return localStorage.getItem('nexus_library') ? JSON.parse(localStorage.getItem('nexus_library')) : [];
}

function displayBooks() {
    const books = getBooks();
    books.sort((a, b) => a.id - b.id).forEach(book => createBookCard(book));
}

function refreshUI() {
    booksContainer.innerHTML = '';
    displayBooks();
}

// Notification Logic
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}