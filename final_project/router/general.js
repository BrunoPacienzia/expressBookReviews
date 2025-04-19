const express = require('express');
let books = require("./booksdb.js");
const { doesExist } = require('./auth_users.js');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if(username && password){
    if(!doesExist(username)){            
    users.push({"username": username, "password": password});
    return res.status(200).json({message: "The user" + (' ') + (username) + " Has been added!"});
    }
    else{
        return res.status(404).json({message: "User already exists!"});
    }

  }
  else{
    return res.status(404).json({message: "Please provide a password and an username"});
  }
});

const getBooksWithPromise = () => {
    return new Promise((resolve, reject) => {
      try {
        const data = books;
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  };

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
   getBooksWithPromise().then((data) => res.send(JSON.stringify(data, null, 4)), 
   (err) => res.send(JSON.stringify(err)))
});

const getBooksByIsbnWithPromise = (isbn) => {
    return new Promise((resolve, reject) => {
      try {
        const data = books[isbn];
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  };

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  getBooksByIsbnWithPromise(isbn).then((data) => res.send(data), 
  (err) => res.send(JSON.stringify(err)))
 });

 const getBooksByAuthorWithPromise = (author) => {
    return new Promise((resolve, reject) => {
      try {
        let data = null;

        let keys = Object.keys(books); 
      
        for(let key of keys){
          if(books[key].author === author){
              data = books[key];
              break;
          }
        }
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  };
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;

  getBooksByAuthorWithPromise(author).then((data) => {
    if(data){
        return res.send(data);
    }
    else{
        return res.status(404).json({message: "Book not found"});
    }
  }, 
  (err) => res.send(JSON.stringify(err)));

});

const getBooksByTitleWithPromise = (title) => {
    return new Promise((resolve, reject) => {
      try {
        let data = null;

        let keys = Object.keys(books); 
      
        for(let key of keys){
          if(books[key].title === title){
              data = books[key];
              break;
          }
        }
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  };

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;

  getBooksByTitleWithPromise(title).then((data) => {
    if(data){
        return res.send(data);
    }
    else{
        return res.status(404).json({message: "Book not found"});
    }
  }, 
  (err) => res.send(JSON.stringify(err)));

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here

  const isbn = req.params.isbn;

  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
