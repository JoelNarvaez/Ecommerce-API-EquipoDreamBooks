const express = require("express");
const router = express.Router();

// IMPORTAR CONTROLADORES DE ADMIN
const { getBooks } = require("../controllers/admin/books.controller.js");

// RUTAS DE ADMIN
router.get("/books", getBooks); 

module.exports = router;
