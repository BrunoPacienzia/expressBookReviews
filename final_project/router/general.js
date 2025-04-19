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
    users.push({username, password});
    res.send("The user" + (' ') + (username) + " Has been added!");
    }
    else{
        res.send("User already exists");
    }

  }
  else{
    res.send("Please provide an username and a password");
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let foundBook = null;

  let keys = Object.keys(books); 

  for(let key of keys){
    if(books[key].author === author){
        foundBook = books[key];
        break;
    }
  }
  if(foundBook){
    res.send(foundBook);
  }
  else {
    res.status(404).json({message: "Book not found"});
  }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let foundBook = null;

  let keys = Object.keys(books); 

  for(let key of keys){
    if(books[key].title === title){
        foundBook = books[key];
        break;
    }
  }
  if(foundBook){
    res.send(foundBook);
  }
  else {
    res.status(404).json({message: "Book not found"});
  }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here

  const isbn = req.params.isbn;

  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
