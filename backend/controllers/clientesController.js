const pool = require("../config/db")

// Listar todos los clientes
const getClientes = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tb_Clientes ORDER BY id_cliente ASC"
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ mensaje: "Error al obtener clientes." })
  }
}

// Obtener un cliente por ID
const getClienteById = async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      "SELECT * FROM tb_Clientes WHERE id_cliente = $1",
      [id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Cliente no encontrado." })
    }
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ mensaje: "Error al obtener cliente." })
  }
}

// Crear cliente
const createCliente = async (req, res) => {
  const { nombre, correo, telefono, empresa, estado } = req.body
  try {
    const result = await pool.query(
      `INSERT INTO tb_Clientes (Nombre, Correo, Telefono, Empresa, Estado, Password, id_Rol)
       VALUES ($1, $2, $3, $4, $5, 'sin_password', 2) RETURNING *`,
      [nombre, correo, telefono, empresa, estado || "activo"]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ mensaje: "Error al crear cliente." })
  }
}

// Actualizar cliente
const updateCliente = async (req, res) => {
  const { id } = req.params
  const { nombre, correo, telefono, empresa, estado } = req.body
  try {
    const result = await pool.query(
      `UPDATE tb_Clientes 
       SET Nombre=$1, Correo=$2, Telefono=$3, Empresa=$4, Estado=$5
       WHERE id_cliente=$6 RETURNING *`,
      [nombre, correo, telefono, empresa, estado, id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Cliente no encontrado." })
    }
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ mensaje: "Error al actualizar cliente." })
  }
}

// Eliminar cliente
const deleteCliente = async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      "DELETE FROM tb_Clientes WHERE id_cliente=$1 RETURNING *",
      [id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Cliente no encontrado." })
    }
    res.json({ mensaje: "Cliente eliminado correctamente." })
  } catch (err) {
    res.status(500).json({ mensaje: "Error al eliminar cliente." })
  }
}

module.exports = { getClientes, getClienteById, createCliente, updateCliente, deleteCliente }