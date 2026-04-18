const express = require("express")
const router = express.Router()
const verifyToken = require("../middleware/authMiddleware")
const {
  getProyectos,
  getProyectoById,
  createProyecto,
  updateProyecto,
  deleteProyecto
} = require("../controllers/proyectosController")

router.get("/", verifyToken, getProyectos)
router.get("/:id", verifyToken, getProyectoById)
router.post("/", verifyToken, createProyecto)
router.put("/:id", verifyToken, updateProyecto)
router.delete("/:id", verifyToken, deleteProyecto)

module.exports = router