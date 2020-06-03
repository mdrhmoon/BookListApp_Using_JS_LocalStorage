// Book Class: Represents a Book
class Book{
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: Handle UI Tasks
class UI{
    static displayBooks(){
        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book));
    }


    static addBookToList(book){
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }


    static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }


    static deleteBook(element){
        if(element.classList.contains('delete')){
            let isbn = element.parentElement.previousElementSibling.textContent
            Store.removeBook(isbn);

            element.parentElement.parentElement.remove();
            UI.showAlert('Book Removed.', 'warning');
        }
    }


    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        //Vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }
}

// Stores Class: Handles Storage
class Store{
    // Get Books From Local Storage.
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }
        else{
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    // Set Book to local Storage.
    static addBook(book){
        const books = Store.getBooks();

        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    // remove Book from Local Storage.
    static removeBook(isbn){
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}
// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // Get Form Values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //validate
    if(title === '' || author === '' || isbn === ''){
        UI.showAlert('Please fill in all fields.', 'danger');
    }
    else{
        // Instantiate book
        const book = new Book(title, author, isbn);
        UI.addBookToList(book);
        Store.addBook(book);

        UI.showAlert('Book Added', 'success');
        // Clear Fields
        UI.clearFields();
    }
});

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
    UI.deleteBook(e.target);
});