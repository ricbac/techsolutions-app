const pool = require("../config/db")

// Listar todos los proyectos
const getProyectos = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, c.Nombre as nombre_cliente 
       FROM tb_Proyectos p
       LEFT JOIN tb_Clientes c ON p.id_cliente = c.id_cliente
       ORDER BY p.id_proyecto ASC`
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ mensaje: "Error al obtener proyectos." })
  }
}

// Obtener proyecto por ID
const getProyectoById = async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      "SELECT * FROM tb_Proyectos WHERE id_proyecto = $1",
      [id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Proyecto no encontrado." })
    }
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ mensaje: "Error al obtener proyecto." })
  }
}

// Crear proyecto
const createProyecto = async (req, res) => {
  const { nombre, descripcion, fecha_inicio, fecha_fin, estado_proyecto, id_cliente } = req.body
  try {
    const result = await pool.query(
      `INSERT INTO tb_Proyectos (Nombre, Descripcion, Fecha_inicio, Fecha_fin, Estado_Proyecto, id_Cliente)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [nombre, descripcion, fecha_inicio, fecha_fin, estado_proyecto || "pendiente", id_cliente]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ mensaje: "Error al crear proyecto." })
  }
}

// Actualizar proyecto
const updateProyecto = async (req, res) => {
  const { id } = req.params
  const { nombre, descripcion, fecha_inicio, fecha_fin, estado_proyecto, id_cliente } = req.body
  try {
    const result = await pool.query(
      `UPDATE tb_Proyectos 
       SET Nombre=$1, Descripcion=$2, Fecha_inicio=$3, Fecha_fin=$4, Estado_Proyecto=$5, id_Cliente=$6
       WHERE id_proyecto=$7 RETURNING *`,
      [nombre, descripcion, fecha_inicio, fecha_fin, estado_proyecto, id_cliente, id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Proyecto no encontrado." })
    }
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ mensaje: "Error al actualizar proyecto." })
  }
}

// Eliminar proyecto
const deleteProyecto = async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      "DELETE FROM tb_Proyectos WHERE id_proyecto=$1 RETURNING *",
      [id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Proyecto no encontrado." })
    }
    res.json({ mensaje: "Proyecto eliminado correctamente." })
  } catch (err) {
    res.status(500).json({ mensaje: "Error al eliminar proyecto." })
  }
}

module.exports = { getProyectos, getProyectoById, createProyecto, updateProyecto, deleteProyecto }