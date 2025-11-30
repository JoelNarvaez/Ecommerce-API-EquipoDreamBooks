
const express = require("express");
const router = express.Router();

const {
    getBooks,       
    obtenerLibro     
} = require("../controllers/usuario/books.controller.js");


router.get("/books", getBooks);
router.get("/books/:id", obtenerLibro);

module.exports = router;



module.exports = router;