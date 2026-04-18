const pool = require("../config/db")

// Listar todas las tareas
const getTareas = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, p.Nombre as nombre_proyecto 
       FROM tb_Tareas t
       LEFT JOIN tb_Proyectos p ON t.id_proyecto = p.id_proyecto
       ORDER BY t.id_tarea ASC`
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ mensaje: "Error al obtener tareas." })
  }
}

// Obtener tarea por ID
const getTareaById = async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      "SELECT * FROM tb_Tareas WHERE id_tarea = $1",
      [id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Tarea no encontrada." })
    }
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ mensaje: "Error al obtener tarea." })
  }
}

// Crear tarea
const createTarea = async (req, res) => {
  const { tarea, descripcion, responsable, prioridad, estado, id_proyecto } = req.body
  try {
    const result = await pool.query(
      `INSERT INTO tb_Tareas (Tarea, Descripcion, Responsable, Prioridad, Estado, id_Proyecto)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [tarea, descripcion, responsable, prioridad || "media", estado || "pendiente", id_proyecto]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ mensaje: "Error al crear tarea." })
  }
}

// Actualizar tarea
const updateTarea = async (req, res) => {
  const { id } = req.params
  const { tarea, descripcion, responsable, prioridad, estado, id_proyecto } = req.body
  try {
    const result = await pool.query(
      `UPDATE tb_Tareas 
       SET Tarea=$1, Descripcion=$2, Responsable=$3, Prioridad=$4, Estado=$5, id_Proyecto=$6
       WHERE id_tarea=$7 RETURNING *`,
      [tarea, descripcion, responsable, prioridad, estado, id_proyecto, id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Tarea no encontrada." })
    }
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ mensaje: "Error al actualizar tarea." })
  }
}

// Eliminar tarea
const deleteTarea = async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      "DELETE FROM tb_Tareas WHERE id_tarea=$1 RETURNING *",
      [id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Tarea no encontrada." })
    }
    res.json({ mensaje: "Tarea eliminada correctamente." })
  } catch (err) {
    res.status(500).json({ mensaje: "Error al eliminar tarea." })
  }
}

module.exports = { getTareas, getTareaById, createTarea, updateTarea, deleteTarea }