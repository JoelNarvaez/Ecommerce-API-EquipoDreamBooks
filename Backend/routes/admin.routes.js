const express = require("express");
const router = express.Router();

// IMPORTAR CONTROLADORES DE ADMIN
const { getBooks, addBook } = require("../controllers/admin/books.controller.js");

// RUTAS DE ADMIN
router.get("/books", getBooks); 
router.post("/agregar", addBook);

module.exports = router;
