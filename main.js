function tambahBuku() {
    const detailBuku = getInputBuku();
    if (!detailBuku) {
        console.log("Data buku tidak lengkatp");
        return;
    }

    const buku = getBookFrmStorage();
    buku.push(detailBuku);
    updateStorage(buku);
    reset();
    refreshBookshelf();
}

function getInputBuku() {
    const title = document.getElementById("bookFormTitle").value.trim();
    const author = document.getElementById("bookFormAuthor").value.trim();
    const year = parseInt(document.getElementById("bookFormYear").value.trim());
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    if (!title || !author || isNaN(year)) {
        return null;
    }

    return { id: generateId(), title, author, year, isComplete };
}

function reset() {
    document.getElementById("bookFormTitle").value = "";
    document.getElementById("bookFormAuthor").value = "";
    document.getElementById("bookFormYear").value = "";
    document.getElementById("bookFormIsComplete").checked = false;
}

function updateStorage(buku) {
    localStorage.setItem("buku", JSON.stringify(buku));
}

function getBookFrmStorage() {
    return JSON.parse(localStorage.getItem("buku")) || [];
}

function refreshBookshelf() {
    const bookshelf = {
        incomplete: document.getElementById("incompleteBookshelfList"),
        complete: document.getElementById("completeBookshelfList")
    };
    
    const buku = getBookFrmStorage();
    clearBookshelf(bookshelf);
    buku.forEach((buku) => tambahBukuKeBookshelf(buku, bookshelf));
}

function clearBookshelf(bookshelf) {
    bookshelf.incomplete.innerHTML = "";
    bookshelf.complete.innerHTML = "";
}

function tambahBukuKeBookshelf(buku, bookshelf) {
    const bookItem = createBookElement(buku);
    buku.isComplete ? bookshelf.complete.appendChild(bookItem) : bookshelf.incomplete.appendChild(bookItem);
}

function createBookElement(buku) {
    const bookItem = document.createElement("article");
    bookItem.classList.add("book_item");
    bookItem.innerHTML = `
    <h3 data-testid="bookItemTitle">${buku.title}</h3>
    <p data-testid="bookItemAuthor"><strong>Penulis:</strong> ${buku.author}</p>
    <p data-testid="bookItemYear"><strong>Tahun:</strong> ${buku.year}</p>
    <div>
        ${buku.isComplete ? `
            <svg id="updateBelumSelesai" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" onclick="updateStatusBuku(${buku.id})">
                <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        ` : `
            <svg id="updateSelesai" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" onclick="updateStatusBuku(${buku.id})">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        `}
        <svg id="hapusBuku" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" onclick="hapusBuku(${buku.id})">
            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
        <svg id="editBuku" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" onclick="editBuku(${buku.id})">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
    </div>
`;
return bookItem;

}

function updateStatusBuku(bookId) {
    const books = getBookFrmStorage();
    const buku = books.find((buku) => buku.id === bookId);

    if (buku) {
        buku.isComplete = !buku.isComplete;
        updateStorage(books);
        refreshBookshelf();
    }
}

function hapusBuku(bookId) {
    let books = getBookFrmStorage();
    books = books.filter((book) => book.id !== bookId);
    updateStorage(books);
    refreshBookshelf();
}

document.addEventListener("DOMContentLoaded", () => {
    refreshBookshelf();
});

document.getElementById("bookFormSubmit").addEventListener("click", (event) => {
    event.preventDefault();
    tambahBuku();
});

function cariBuku(title) {
    return getBookFrmStorage().filter((book) =>
        book.title.toLowerCase().includes(title.toLowerCase())
    );
}

document.getElementById("searchBook").addEventListener("submit", (event) => {
    event.preventDefault();
    const searchTitle = document.getElementById("searchBookTitle").value;
    const searchResults = cariBuku(searchTitle);
    showSearchResult(searchResults);
});

function showSearchResult(searchResults) {
    const bookshelf = {
        incomplete: document.getElementById("incompleteBookshelfList"),
        complete: document.getElementById("completeBookshelfList")
    };
    
    clearBookshelf(bookshelf);
    searchResults.forEach((book) => tambahBukuKeBookshelf(book, bookshelf));
}

function generateId() {
    return +new Date();
}

document.getElementById("dicoding_btn").addEventListener("click", function() {
    window.location.href = "https://www.dicoding.com"; 
});

let currentEditBookId = null;

function editBuku(bookId) {
  const books = getBookFrmStorage();
  const bookToEdit = books.find(book => book.id === bookId);

  if (bookToEdit) {
    currentEditBookId = bookId;
    document.getElementById("editBookFormTitle").value = bookToEdit.title;
    document.getElementById("editBookFormAuthor").value = bookToEdit.author;
    document.getElementById("editBookFormYear").value = bookToEdit.year;
    document.getElementById("editBookFormIsComplete").checked = bookToEdit.isComplete;

    openEditModal();
  }
}

function openEditModal() {
    document.getElementById("editBookModal").style.display = "flex";
    const tambahBukuElements = document.getElementsByClassName("tambahbuku");
    for (let i = 0; i < tambahBukuElements.length; i++) {
        tambahBukuElements[i].style.display = "none";
    }
}

function closeEditModal() {
    document.getElementById("editBookModal").style.display = "none";
    const tambahBukuElements = document.getElementsByClassName("tambahbuku");
    for (let i = 0; i < tambahBukuElements.length; i++) {
        tambahBukuElements[i].style.display = "flex";
    }
    currentEditBookId = null;
}

document.getElementById("editBookForm").addEventListener("submit", function(event) {
  event.preventDefault();
  
  const updatedTitle = document.getElementById("editBookFormTitle").value.trim();
  const updatedAuthor = document.getElementById("editBookFormAuthor").value.trim();
  const updatedYear = parseInt(document.getElementById("editBookFormYear").value.trim());
  const isComplete = document.getElementById("editBookFormIsComplete").checked;

  if (currentEditBookId !== null) {
    const books = getBookFrmStorage();
    const bookIndex = books.findIndex(book => book.id === currentEditBookId);
    
    if (bookIndex !== -1) {
      books[bookIndex].title = updatedTitle;
      books[bookIndex].author = updatedAuthor;
      books[bookIndex].year = updatedYear;
      books[bookIndex].isComplete = isComplete;

      updateStorage(books);
      refreshBookshelf();
      closeEditModal();
    }
  }
});
