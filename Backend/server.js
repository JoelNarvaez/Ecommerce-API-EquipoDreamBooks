// Cargar variables de entorno
require('dotenv').config({ override: true });

const pool = require('./config/db');

// Importar dependencias
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Importar rutas
const authRoutes = require("./routes/auth.routes");
// const userRoutes = require("./routes/user.routes.js");  
const productRoutes = require("./routes/products.routes.js");
// const orderRoutes = require("./routes/order.routes.js");
// const cartRoutes = require("./routes/cart.routes.js");
const adminRoutes = require("./routes/admin.routes.js");

// Middlewares mínimos
app.use(express.json());

const ALLOWED_ORIGINS = [
  'http://127.0.0.1:5501', 
  'http://127.0.0.1:5500', 
  'http://localhost:5500',
  'http://localhost:5501',
];

app.use(morgan('dev'))
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

// imagenes
app.use("/uploads", express.static(path.join(__dirname, "assets", "public", "libros")));

// Rutas
app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/carts", cartRoutes);
app.use("/api/admin", adminRoutes);


// archivos publicos para consulta
const folderPath = path.join(__dirname,"assets/public")
app.use("/public/images",express.static(folderPath))  // Se asigna alias /public a la ruta guardada en folderpath, express va utilizar esa ruta como estática con el alias con el que se le asigno para poder acceder a todos los archivos dentro de esa ruta


// Ruta de salud
app.get("/health", (_req, res) => res.json({ ok: true }));

async function testConnection() {
try {
const [rows] = await pool.query('SELECT 1 + 1 AS result'); //Le pide a MySQL que sume 1 + 1, y le ponga el alias result al valor
console.log(' Conexión a la base de datos establecida. Resultado:', rows[0].result);
} catch (error) {
console.error(' Error al conectar con la base de datos:', error.message);
}
}

app.listen(PORT, async () => {
console.log(`Servidor escuchando en http://localhost:${PORT}`);
await testConnection(); 
});
