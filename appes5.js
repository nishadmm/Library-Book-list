// Book constructor
function Book(title, author, isbn) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}

// UI constructor
function UI() { }

// Add book to list
UI.prototype.addBookToList = function (book) {

  const list = document.getElementById('table-list');

  // Create tr
  const row = document.createElement('tr');

  // Add innerHTML
  row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class= "delete">Remove</a></td>
  `;

  // append into table
  list.appendChild(row);
}

// Clear fields
UI.prototype.clearFields = function () {
  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
  document.getElementById('isbn').value = '';
}

// Show Message
UI.prototype.showMessage = function (msg, className) {
  // Create div
  const message = document.createElement('div');
  // Add class
  message.className = className;
  // Add text
  message.appendChild(document.createTextNode(msg));
  // Get parent
  const form = document.getElementById('form');
  // Get before element
  const titleDiv = document.getElementById('first-child');
  // Insert before table-heading
  form.insertBefore(message, titleDiv);
  //Set timeout
  setTimeout(function () {
    message.remove();
  }, 2000)
}

// Remove Book
UI.prototype.removeBook = function (target) {
  if (target.className === 'delete') {
    target.parentElement.parentElement.remove();
  }
}

// LS Constructor
function Store() { }

// Get book to LS
Store.prototype.getBook = function () {
  let books;
  if (localStorage.getItem('books') === null) {
    books = [];
  } else {
    books = JSON.parse(localStorage.getItem('books'));
  }
  return books;
}

// Display book
Store.prototype.displayBook = function () {

  const getBook = new Store();
  const books = getBook.getBook();
  books.forEach(function (book) {

    const ui = new UI();
    ui.addBookToList(book);
  });
}

// Add book to ls
Store.prototype.addBook = function (book) {

  const store = new Store();
  const books = store.getBook();
  books.push(book);
  localStorage.setItem('books', JSON.stringify(books));
}

// Remove from LS
Store.prototype.removeBook = function (isbn) {
  const store = new Store();
  const books = store.getBook();

  books.forEach(function (book, index) {
    if (book.isbn === isbn) {
      books.splice(index, 1);
    }
  });
  localStorage.setItem('books', JSON.stringify(books));
}

// DOM listner
document.addEventListener('DOMContentLoaded', function () {

  const store = new Store();
  store.displayBook();
});

// Listner For Submit
document.getElementById('form').addEventListener('submit', function (e) {

  // Get Deatils
  const title = document.getElementById('title').value,
    author = document.getElementById('author').value,
    isbn = document.getElementById('isbn').value

  // Instantiate Book
  const book = new Book(title, author, isbn);

  // Instantiate UI
  const ui = new UI();

  // Instantaite Store
  const store = new Store();

  if (title === '' || author === '' || isbn === '') {

    // Show Message
    ui.showMessage('Please Fill All The Blanks !', 'error');
  } else {

    // Add book to list
    ui.addBookToList(book);

    // Add book to LS
    store.addBook(book);

    // Clear fields
    ui.clearFields();

    // Show Message
    ui.showMessage('Sucessfully Added ', 'sucess');
  }

  e.preventDefault();
});

// Remove book listner
document.getElementById('table-list').addEventListener('click', function (e) {

  // Instantiate UI
  const ui = new UI();

  // Instantaite Store
  const store = new Store();

  // Remove book
  ui.removeBook(e.target);

  // Remove From Ls
  store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // Show Message
  ui.showMessage('Book Deleted ', 'error');
});