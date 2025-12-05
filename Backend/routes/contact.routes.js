const express = require("express");
const router = express.Router();

const { contactMessage } = require("../controllers/contact/contact.controller");
const { subscribirUsuario } = require("../controllers/contact/subscribirUsuario.controller");

router.post("/", contactMessage);

router.post('/subscribir', subscribirUsuario)

module.exports = router;
