const express = require("express")
const router = express.Router()
const verifyToken = require("../middleware/authMiddleware")
const { crearUsuario } = require("../controllers/authController")

// Solo el administrador puede crear usuarios
router.post("/", verifyToken, crearUsuario)

// Listar usuarios con rol 2
router.get("/", verifyToken, async (req, res) => {
  const pool = require("../config/db")
  try {
    const result = await pool.query(
      "SELECT id_cliente, Nombre, Correo, Telefono, Empresa, Estado FROM tb_Clientes WHERE id_Rol = 2"
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ mensaje: "Error al obtener usuarios." })
  }
})

// Eliminar usuario
router.delete("/:id", verifyToken, async (req, res) => {
  const pool = require("../config/db")
  const { id } = req.params
  try {
    await pool.query("DELETE FROM tb_Clientes WHERE id_cliente = $1 AND id_Rol = 2", [id])
    res.json({ mensaje: "Usuario eliminado correctamente." })
  } catch (err) {
    res.status(500).json({ mensaje: "Error al eliminar usuario." })
  }
})

module.exports = router