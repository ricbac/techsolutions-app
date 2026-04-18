import { useEffect, useState } from "react"
import axios from "axios"
import Navbar from "../components/Navbar"

function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [mensaje, setMensaje] = useState("")
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    nombre: "", correo: "", telefono: "", empresa: "", password: ""
  })

  const token = localStorage.getItem("token")
  const headers = { Authorization: `Bearer ${token}` }

  const cargarUsuarios = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/usuarios`, { headers })
      setUsuarios(res.data)
    } catch (err) {
      setError("Error al cargar usuarios.")
    }
  }

  useEffect(() => {
    cargarUsuarios()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleGuardar = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/usuarios`, form, { headers })
      setMensaje("Usuario creado correctamente.")
      setMostrarFormulario(false)
      setForm({ nombre: "", correo: "", telefono: "", empresa: "", password: "" })
      setError("")
      cargarUsuarios()
      setTimeout(() => setMensaje(""), 3000)
    } catch (err) {
      setError(err.response?.data?.mensaje || "Error al crear usuario.")
    }
  }

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/usuarios/${id}`, { headers })
      setMensaje("Usuario eliminado correctamente.")
      cargarUsuarios()
      setTimeout(() => setMensaje(""), 3000)
    } catch (err) {
      setError("Error al eliminar usuario.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h2>
            <p className="text-gray-500 text-sm mt-1">Administra los usuarios del sistema</p>
          </div>
          <button
            onClick={() => setMostrarFormulario(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            + Nuevo Usuario
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
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Nuevo Usuario</h3>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                <input
                  type="email"
                  name="correo"
                  value={form.correo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                <input
                  type="text"
                  name="empresa"
                  value={form.empresa}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
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
                  Crear Usuario
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
                <th className="px-6 py-3 text-left">Correo</th>
                <th className="px-6 py-3 text-left">Teléfono</th>
                <th className="px-6 py-3 text-left">Empresa</th>
                <th className="px-6 py-3 text-left">Rol</th>
                <th className="px-6 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">
                    No hay usuarios registrados
                  </td>
                </tr>
              ) : (
                usuarios.map((usuario) => (
                  <tr key={usuario.id_cliente} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">{usuario.nombre}</td>
                    <td className="px-6 py-4 text-gray-600">{usuario.correo}</td>
                    <td className="px-6 py-4 text-gray-600">{usuario.telefono}</td>
                    <td className="px-6 py-4 text-gray-600">{usuario.empresa}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        Usuario
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleEliminar(usuario.id_cliente)}
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

export default Usuarios