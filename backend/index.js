const express = require("express")
const cors = require("cors")
require("dotenv").config()

const pool = require("./config/db")

// Probar conexión a base de datos
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Error conectando a la base de datos:", err.message)
  } else {
    console.log("✅ Base de datos conectada:", res.rows[0].now)
  }
})

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Rutas
app.use("/api/auth", require("./routes/auth"))
app.use("/api/clientes", require("./routes/clientes"))
app.use("/api/proyectos", require("./routes/proyectos"))
app.use("/api/tareas", require("./routes/tareas"))

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ mensaje: "API TechSolutions funcionando ✅" })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})
