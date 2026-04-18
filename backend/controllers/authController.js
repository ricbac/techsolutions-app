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

const crearUsuario = async (req, res) => {
  const { nombre, correo, telefono, empresa, password } = req.body

  try {
    // Verificar si el correo ya existe
    const existe = await pool.query(
      "SELECT * FROM tb_Clientes WHERE Correo = $1",
      [correo]
    )
    if (existe.rows.length > 0) {
      return res.status(400).json({ mensaje: "El correo ya está registrado." })
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear usuario con rol 2
    const result = await pool.query(
      `INSERT INTO tb_Clientes (Nombre, Correo, Telefono, Empresa, Estado, Password, id_Rol)
       VALUES ($1, $2, $3, $4, 'activo', $5, 2) RETURNING *`,
      [nombre, correo, telefono || "", empresa || "", hashedPassword]
    )

    res.status(201).json({
      mensaje: "Usuario creado correctamente.",
      usuario: result.rows[0]
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ mensaje: "Error al crear usuario." })
  }
}
module.exports = { login, crearUsuario }