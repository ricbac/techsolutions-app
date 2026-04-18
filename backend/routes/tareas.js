const express = require("express")
const router = express.Router()
const verifyToken = require("../middleware/authMiddleware")
const {
  getTareas,
  getTareaById,
  createTarea,
  updateTarea,
  deleteTarea
} = require("../controllers/tareasController")

router.get("/", verifyToken, getTareas)
router.get("/:id", verifyToken, getTareaById)
router.post("/", verifyToken, createTarea)
router.put("/:id", verifyToken, updateTarea)
router.delete("/:id", verifyToken, deleteTarea)

module.exports = router