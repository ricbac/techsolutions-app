import { useEffect, useState } from "react"
import axios from "axios"
import Navbar from "../components/Navbar"

function Tareas() {
  const [tareas, setTareas] = useState([])
  const [proyectos, setProyectos] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [tareaEditando, setTareaEditando] = useState(null)
  const [mensaje, setMensaje] = useState("")
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    tarea: "",
    descripcion: "",
    responsable: "",
    prioridad: "media",
    estado: "pendiente",
    id_proyecto: ""
  })

  const token = localStorage.getItem("token")
  const headers = { Authorization: `Bearer ${token}` }

  const cargarTareas = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/tareas`, { headers })
      setTareas(res.data)
    } catch (err) {
      setError("Error al cargar tareas.")
    }
  }

  const cargarProyectos = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/proyectos`, { headers })
      setProyectos(res.data)
    } catch (err) {
      setError("Error al cargar proyectos.")
    }
  }

  useEffect(() => {
    cargarTareas()
    cargarProyectos()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleNuevo = () => {
    setForm({
      tarea: "",
      descripcion: "",
      responsable: "",
      prioridad: "media",
      estado: "pendiente",
      id_proyecto: ""
    })
    setTareaEditando(null)
    setMostrarFormulario(true)
  }

  const handleEditar = (tarea) => {
    setForm({
      tarea: tarea.tarea,
      descripcion: tarea.descripcion,
      responsable: tarea.responsable,
      prioridad: tarea.prioridad,
      estado: tarea.estado,
      id_proyecto: tarea.id_proyecto
    })
    setTareaEditando(tarea.id_tarea)
    setMostrarFormulario(true)
  }

  const handleGuardar = async (e) => {
    e.preventDefault()
    try {
      if (tareaEditando) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/tareas/${tareaEditando}`, form, { headers })
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/tareas`, form, { headers })
        setMensaje("Tarea creada correctamente.")
      }
      setMostrarFormulario(false)
      setError("")
      cargarTareas()
      setTimeout(() => setMensaje(""), 3000)
    } catch (err) {
      setError("Error al guardar tarea.")
    }
  }

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta tarea?")) return
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/tareas/${id}`, { headers })
      setMensaje("Tarea eliminada correctamente.")
      cargarTareas()
      setTimeout(() => setMensaje(""), 3000)
    } catch (err) {
      setError("Error al eliminar tarea.")
    }
  }

  const prioridadColor = (prioridad) => {
    switch (prioridad) {
      case "alta": return "bg-red-100 text-red-700"
      case "baja": return "bg-green-100 text-green-700"
      default: return "bg-yellow-100 text-yellow-700"
    }
  }

  const estadoColor = (estado) => {
    switch (estado) {
      case "completada": return "bg-green-100 text-green-700"
      case "en_progreso": return "bg-blue-100 text-blue-700"
      case "cancelada": return "bg-red-100 text-red-600"
      default: return "bg-yellow-100 text-yellow-700"
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Gestión de Tareas</h2>
            <p className="text-gray-500 text-sm mt-1">Administra las tareas de TechSolutions</p>
          </div>
          <button
            onClick={handleNuevo}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            + Nueva Tarea
          </button>
        </div>

        {mensaje && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{mensaje}</div>
        )}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">{error}</div>
        )}

        {mostrarFormulario && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              {tareaEditando ? "Editar Tarea" : "Nueva Tarea"}
            </h3>
            <form onSubmit={handleGuardar} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tarea</label>
                <input
                  type="text"
                  name="tarea"
                  value={form.tarea}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proyecto</label>
                <select
                  name="id_proyecto"
                  value={form.id_proyecto}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecciona un proyecto</option>
                  {proyectos.map((p) => (
                    <option key={p.id_proyecto} value={p.id_proyecto}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                <input
                  type="text"
                  name="responsable"
                  value={form.responsable}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                <select
                  name="prioridad"
                  value={form.prioridad}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en_progreso">En Progreso</option>
                  <option value="completada">Completada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2 flex gap-3 justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setMostrarFormulario(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                  {tareaEditando ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Tarea</th>
                <th className="px-6 py-3 text-left">Proyecto</th>
                <th className="px-6 py-3 text-left">Responsable</th>
                <th className="px-6 py-3 text-left">Prioridad</th>
                <th className="px-6 py-3 text-left">Estado</th>
                <th className="px-6 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tareas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">
                    No hay tareas registradas
                  </td>
                </tr>
              ) : (
                tareas.map((tarea) => (
                  <tr key={tarea.id_tarea} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">{tarea.tarea}</td>
                    <td className="px-6 py-4 text-gray-600">{tarea.nombre_proyecto}</td>
                    <td className="px-6 py-4 text-gray-600">{tarea.responsable}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${prioridadColor(tarea.prioridad)}`}>
                        {tarea.prioridad}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${estadoColor(tarea.estado)}`}>
                        {tarea.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => handleEditar(tarea)}
                        className="bg-yellow-400 text-white px-3 py-1 rounded-lg text-xs hover:bg-yellow-500 transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(tarea.id_tarea)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-600 transition"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Tareas