const express = require("express")
const router = express.Router()
const verifyToken = require("../middleware/authMiddleware")
const {
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente
} = require("../controllers/clientesController")

router.get("/", verifyToken, getClientes)
router.get("/:id", verifyToken, getClienteById)
router.post("/", verifyToken, createCliente)
router.put("/:id", verifyToken, updateCliente)
router.delete("/:id", verifyToken, deleteCliente)

module.exports = router