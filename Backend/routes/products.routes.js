
const express = require("express");
const router = express.Router();

const {
    getBooks,       
    getBookById    
} = require("../controllers/usuario/books.controller.js");


router.get("/books", getBooks);
router.get("/book/:id", getBookById);


module.exports = router;

