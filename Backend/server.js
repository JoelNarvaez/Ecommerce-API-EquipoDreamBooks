// Cargar variables de entorno
require('dotenv').config({ override: true });

// Importar dependencias
const express = require("express");
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Importar rutas
const authRoutes = require("./routes/auth.routes.js");
const userRoutes = require("./routes/user.routes.js");  
const productRoutes = require("./routes/products.routes.js");
const orderRoutes = require("./routes/order.routes.js");
const cartRoutes = require("./routes/cart.routes.js");
const adminRoutes = require("./routes/admin.routes.js");

// Middlewares mínimos
app.use(express.json());

const ALLOWED_ORIGINS = [
  'http://127.0.0.1:5501', 
  'http://127.0.0.1:5500', 
];

app.use(cors({ 
  origin: function (origin, callback) {
    
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true); 
    }
    return callback(new Error('Not allowed by CORS: ' + origin));
  },

  // Metdos permitidos
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  optionsSuccessStatus: 200
}));


// Rutas
app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/carts", cartRoutes);
// app.use("/api/admin", adminRoutes);


// Ruta de salud
app.get("/health", (_req, res) => res.json({ ok: true }));

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
