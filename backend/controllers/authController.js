const pool = require("../config/db")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const login = async (req, res) => {
  const { email, password } = req.body

  console.log("📧 Email recibido:", email)
  console.log("🔑 Password recibido:", password)

  try {
    const result = await pool.query(
      "SELECT * FROM tb_Clientes WHERE Correo = $1",
      [email]
    )

    console.log("👤 Usuario encontrado:", result.rows.length)

    if (result.rows.length === 0) {
      return res.status(401).json({ mensaje: "Correo o contraseña incorrectos." })
    }

    const usuario = result.rows[0]
    console.log("🔐 Hash en BD:", usuario.password)

    const passwordValida = await bcrypt.compare(password, usuario.password)
    console.log("✅ Password válida:", passwordValida)

    if (!passwordValida) {
      return res.status(401).json({ mensaje: "Correo o contraseña incorrectos." })
    }

    const token = jwt.sign(
      {
        id: usuario.id_cliente,
        nombre: usuario.nombre,
        rol: usuario.id_rol
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    )

    res.json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: usuario.id_cliente,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.id_rol
      }
    })

  } catch (err) {
    console.error("❌ Error:", err)
    res.status(500).json({ mensaje: "Error interno del servidor." })
  }
}

module.exports = { login }