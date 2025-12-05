const express = require("express");
const router = express.Router();

const { agregarWishlist, obtenerWishlist, eliminarWishlist } =
    require("../controllers/wishlist/wishlist.controller");

const { verifyToken } = require("../middlewares/authMiddleware");

// CRUD wishlist real:
router.post("/add", verifyToken, agregarWishlist);
router.get("/", verifyToken, obtenerWishlist);
router.delete("/:idProducto", verifyToken, eliminarWishlist);

module.exports = router;
