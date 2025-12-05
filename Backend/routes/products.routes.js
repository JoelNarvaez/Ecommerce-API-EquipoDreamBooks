// routes/usuario/books.routes.js
const express = require("express");
const router = express.Router();

const {
    getBooks,
    getBook,
    getNovedades,
    getOfertas,
    getCategorias,
    getBooksByCategoria
} = require("../controllers/usuario/books.controller");

router.get("/books", getBooks);
router.get("/book/:id", getBook);

router.get("/books/novedades", getNovedades);
router.get("/books/ofertas", getOfertas);

router.get("/books/categoria/:categoria", getBooksByCategoria);

router.get("/categorias", getCategorias);


module.exports = router;
