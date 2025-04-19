const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;


  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if(authenticatedUser(username, password)){
    
    let token = jwt.sign({data: password}, "access", {expiresIn: 60*60});
    req.session.authorization = {
        "accessToken": token, "username": username
    };
    return res.status(200).json({message: "User successfully logged in"});
  }
  else{
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }

  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const newReview = req.query.review;
  if(!newReview){
    return res.status(404).json({message: "Please provide a review"})
  }

  let book = books[isbn];

  if(!book){
    return res.status(404).json({message: "Book not found"});
  }

  let user = req.session.authorization.username

  book.reviews[user] = newReview;

  return res.status(200).json({message: "Review added/updated"});

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;

    let book = books[isbn];
  
    if(!book){
      return res.status(404).json({message: "Book not found"});
    }
  
    let user = req.session.authorization.username
  
    delete book.reviews[user];
  
    return res.status(200).json({message: "Review deleted"});
  
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.doesExist = doesExist;
