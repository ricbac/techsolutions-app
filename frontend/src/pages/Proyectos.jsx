import { useEffect, useState } from "react"
import axios from "axios"
import Navbar from "../components/Navbar"

function Proyectos() {
  const [proyectos, setProyectos] = useState([])
  const [clientes, setClientes] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [proyectoEditando, setProyectoEditando] = useState(null)
  const [mensaje, setMensaje] = useState("")
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    fecha_inicio: "",
    fecha_fin: "",
    estado_proyecto: "pendiente",
    id_cliente: ""
  })

  const token = localStorage.getItem("token")
  const headers = { Authorization: `Bearer ${token}` }

  const cargarProyectos = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/proyectos`, { headers })
    } catch (err) {
      setError("Error al cargar proyectos.")
    }
  }

  const cargarClientes = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/clientes`, { headers })
      setClientes(res.data)
    } catch (err) {
      setError("Error al cargar clientes.")
    }
  }

  useEffect(() => {
    cargarProyectos()
    cargarClientes()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleNuevo = () => {
    setForm({
      nombre: "",
      descripcion: "",
      fecha_inicio: "",
      fecha_fin: "",
      estado_proyecto: "pendiente",
      id_cliente: ""
    })
    setProyectoEditando(null)
    setMostrarFormulario(true)
  }

  const handleEditar = (proyecto) => {
    setForm({
      nombre: proyecto.nombre,
      descripcion: proyecto.descripcion,
      fecha_inicio: proyecto.fecha_inicio?.split("T")[0] || "",
      fecha_fin: proyecto.fecha_fin?.split("T")[0] || "",
      estado_proyecto: proyecto.estado_proyecto,
      id_cliente: proyecto.id_cliente
    })
    setProyectoEditando(proyecto.id_proyecto)
    setMostrarFormulario(true)
  }

  const handleGuardar = async (e) => {
    e.preventDefault()
    try {
      if (proyectoEditando) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/proyectos/${proyectoEditando}`, form, { headers })
        setMensaje("Proyecto actualizado correctamente.")
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/proyectos`, form, { headers })
        setMensaje("Proyecto creado correctamente.")
      }
      setMostrarFormulario(false)
      setError("")
      cargarProyectos()
      setTimeout(() => setMensaje(""), 3000)
    } catch (err) {
      setError("Error al guardar proyecto.")
    }
  }

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este proyecto?")) return
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/proyectos/${id}`, { headers })
      setMensaje("Proyecto eliminado correctamente.")
      cargarProyectos()
      setTimeout(() => setMensaje(""), 3000)
    } catch (err) {
      setError("Error al eliminar proyecto.")
    }
  }

  const estadoColor = (estado) => {
    switch (estado) {
      case "completado": return "bg-green-100 text-green-700"
      case "en_progreso": return "bg-blue-100 text-blue-700"
      case "cancelado": return "bg-red-100 text-red-600"
      default: return "bg-yellow-100 text-yellow-700"
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Gestión de Proyectos</h2>
            <p className="text-gray-500 text-sm mt-1">Administra los proyectos de TechSolutions</p>
          </div>
          <button
            onClick={handleNuevo}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            + Nuevo Proyecto
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
              {proyectoEditando ? "Editar Proyecto" : "Nuevo Proyecto"}
            </h3>
            <form onSubmit={handleGuardar} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                <select
                  name="id_cliente"
                  value={form.id_cliente}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecciona un cliente</option>
                  {clientes.map((c) => (
                    <option key={c.id_cliente} value={c.id_cliente}>
                      {c.nombre}
                    </option>
                  ))}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                <input
                  type="date"
                  name="fecha_inicio"
                  value={form.fecha_inicio}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                <input
                  type="date"
                  name="fecha_fin"
                  value={form.fecha_fin}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  name="estado_proyecto"
                  value={form.estado_proyecto}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en_progreso">En Progreso</option>
                  <option value="completado">Completado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
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
                  {proyectoEditando ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Nombre</th>
                <th className="px-6 py-3 text-left">Cliente</th>
                <th className="px-6 py-3 text-left">Fecha Inicio</th>
                <th className="px-6 py-3 text-left">Fecha Fin</th>
                <th className="px-6 py-3 text-left">Estado</th>
                <th className="px-6 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {proyectos.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">
                    No hay proyectos registrados
                  </td>
                </tr>
              ) : (
                proyectos.map((proyecto) => (
                  <tr key={proyecto.id_proyecto} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">{proyecto.nombre}</td>
                    <td className="px-6 py-4 text-gray-600">{proyecto.nombre_cliente}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {proyecto.fecha_inicio?.split("T")[0] || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {proyecto.fecha_fin?.split("T")[0] || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${estadoColor(proyecto.estado_proyecto)}`}>
                        {proyecto.estado_proyecto}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => handleEditar(proyecto)}
                        className="bg-yellow-400 text-white px-3 py-1 rounded-lg text-xs hover:bg-yellow-500 transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(proyecto.id_proyecto)}
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

export default Proyectos