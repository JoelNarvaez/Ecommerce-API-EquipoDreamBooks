// routes/usuario/books.routes.js
const express = require("express");
const router = express.Router();

const {
    getBooks,
    getBook
} = require("../controllers/usuario/books.controller");

router.get("/books", getBooks);
router.get("/book/:id", getBook);

module.exports = router;
