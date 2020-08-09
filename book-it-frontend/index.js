let currentUser = {};
let currentBookId;


document.addEventListener("DOMContentLoaded", () => {
  fetchBooks();

  //USER
  newUser.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("userForm").hidden = !document.getElementById("userForm").hidden
    document.getElementById("top").hidden = !document.getElementById("top").hidden;
  });

  //USER
  closeNewUser.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("userForm").hidden = !document.getElementById("userForm").hidden
    document.getElementById("top").hidden = !document.getElementById("top").hidden;
  });

  //USER 
  document.getElementById("submitNewUser").addEventListener("click", (event) => {
    document.getElementById("newBook").hidden = false;
    document.getElementById("newUser").hidden = true;

    event.preventDefault();
    if (document.getElementById('username').value === "" || document.getElementById('grade').value === "") {
      alert('Please enter a Username & Grade');
    }
    else {
      assembleCurrentUser();
    }
  });

  //BOOK
  newBook.addEventListener("click", (event) => {
    event.preventDefault();

    document.getElementById("bookForm").hidden = !document.getElementById("bookForm").hidden;
    document.getElementById("top").hidden = !document.getElementById("top").hidden;
  });

  //BOOK
  closeNewBook.addEventListener("click", (event) => {
    document.getElementById("bookForm").hidden = true;
    document.getElementById("top").hidden = false;
  });

  //BOOK
  document.getElementById("submitNewBook").addEventListener("click", (event) => {
    event.preventDefault();
    if (document.getElementById('title').value === "" || document.getElementById('author').value === "" || document.getElementById('subject').value === "" || document.getElementById('rating').value === "") {
      alert('Required fields: Title, Author, Subject, Rating');
    }
    else {
      createNewBook();
    }
    document.getElementById("bookFormId").reset();
  });

  //COMMENT
  document.getElementById("submitNewComment").addEventListener("click", (event) => {
    event.preventDefault();
    if (document.getElementById('body').value === "") {
      alert('Required field');
    }
    else {
      createNewComment();
    }
    document.getElementById("commentFormId").reset();
  });

  //COMMENT
  document.getElementById("closeNewComment").addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("commentForm").hidden = !document.getElementById("commentForm").hidden;
  });

  //COMMENT
  document.getElementById("closeComments").addEventListener("click", (event) => {
    event.preventDefault();
    closeAllComments();
  })

  //USER && COMMENT
  if (Object.keys(currentUser).length === 0) {
    document.getElementById("newBook").hidden = true;
    document.getElementById("newUser").hidden = false;
  };

  document.getElementById("getSubject").addEventListener("click", (event) => {
    event.preventDefault();
    let selSubject = document.getElementById("selectSubject");
    let subject = (selSubject[selSubject.selectedIndex].value)

    fetchBooks(subject)
  })

  document.getElementById("newComment").addEventListener("click", (event) => {
    event.preventDefault();
    if (Object.keys(currentUser).length === 0) {
      alert('Please Complete User Form to Post');
    }
    else {
      document.getElementById("commentForm").hidden = !document.getElementById("commentForm").hidden
    }
  });
});

//COMMENT
function createNewComment() {
  const body = document.getElementById('body').value
  const username = currentUser.username
  const book_id = currentBookId

  let comment = {
    body: body,
    username: username,
    book_id: book_id
  }

  let configObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(comment)
  }

  fetch("http://localhost:3000/books/" + currentBookId + "/comments", configObj)

    .then(resp => (resp.json()))
    .then(comment => {
      let c = new Comment(comment)
      c.renderComment();
    })
}

//COMMENT
function toggleComments(id) {
  (event) => {
    event.preventDefault()
  };
  currentBookId = id;
  fetchComments(id);
  closeAllComments();
}

//COMMENT
function closeAllComments() {
  document.getElementById("comments").innerHTML = '';
  document.getElementById("bookComments").hidden = !document.getElementById("bookComments").hidden;
  document.getElementById("books").hidden = !document.getElementById("books").hidden;
  document.getElementById("top").hidden = !document.getElementById("top").hidden;
  document.getElementById("dropDown").hidden = !document.getElementById("dropDown").hidden;

}

//COMMENT
function fetchComments(id) {

  document.getElementById("commentsList").innerHTML = '';
  fetch("http://localhost:3000/books/" + id + "/comments")
    .then(resp => resp.json())
    .then(comments => {
      for (const comment of comments) {
        let c = new Comment(comment);
        c.renderComment();
      }
    })
}

//BOOK
function createNewBook() {
  const title = document.getElementById('title').value.split(' ').map(w => w.substring(0, 1).toUpperCase() + w.substring(1)).join(' ');
  const author = document.getElementById('author').value.split(' ').map(w => w.substring(0, 1).toUpperCase() + w.substring(1)).join(' ');
  const publisher = document.getElementById('publisher').value
  const subject = document.getElementById('subject').value
  const review = document.getElementById('review').value
  const rating = document.getElementById('rating').value

  let book = {
    title: title,
    author: author,
    publisher: publisher,
    subject: subject,
    review: review,
    rating: rating,
    poster_username: currentUser.username,
    poster_email: currentUser.email,
    poster_grade: currentUser.grade,
    likes: 0,
  }

  let configObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(book)
  }

  fetch("http://localhost:3000/books", configObj)
    .then(resp => (resp.json()))
    .then(book => {
      let b = new Book(book)
      b.renderBook();
    })
}

//BOOK
function fetchBooks(subject) {
  document.getElementById("dropDown").hidden = false;

  document.getElementById("books").innerHTML = '';
  fetch("http://localhost:3000/books")
    .then(resp => resp.json())
    .then(books => {
      //console.log(books)
      if (subject) {
        let filteredBooks = books.filter(book => book.subject == subject);
        //console.log(filteredBooks)
        filteredBooks.sort((a, b) => a.id - b.id);
        for (const book of filteredBooks) {
          let b = new Book(book);
          b.renderBook();
        }
      }
      else {
        books.sort((a, b) => a.id - b.id);
        for (const book of books) {
          let b = new Book(book);
          b.renderBook();
        }
      }
    })
}

//BOOK
function likeBook(event, id) {
  event.preventDefault();
  fetch("http://localhost:3000/books/" + id)
    .then(resp => resp.json())
    .then(json => {
      let formData = {
        "likes": json.likes + 1
      };

      let configObj = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData)
      };

      fetch("http://localhost:3000/books/" + id, configObj)
        .then(() => fetchBooks())
    })
}

//USER
function assembleCurrentUser() {
  currentUser.username = document.getElementById('username').value
  currentUser.email = document.getElementById('email').value
  currentUser.grade = document.getElementById('grade').value

  if (currentUser) {
    document.getElementById("interName").hidden = !document.getElementById("interName").hidden;
    document.getElementById("interName").innerHTML = ', ' + currentUser.username;
  }

  document.getElementById("userForm").hidden = true;
  document.getElementById("top").hidden = false;
}
