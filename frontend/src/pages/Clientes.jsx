import { useEffect, useState } from "react"
import axios from "axios"
import Navbar from "../components/Navbar"

function Clientes() {
  const [clientes, setClientes] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [clienteEditando, setClienteEditando] = useState(null)
  const [mensaje, setMensaje] = useState("")
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    nombre: "", correo: "", telefono: "", empresa: "", estado: "activo"
  })

  const token = localStorage.getItem("token")
  const headers = { Authorization: `Bearer ${token}` }

  // Cargar clientes
  const cargarClientes = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/clientes", { headers })
      setClientes(res.data)
    } catch (err) {
      setError("Error al cargar clientes.")
    }
  }

  useEffect(() => {
    cargarClientes()
  }, [])

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Abrir formulario para crear
  const handleNuevo = () => {
    setForm({ nombre: "", correo: "", telefono: "", empresa: "", estado: "activo" })
    setClienteEditando(null)
    setMostrarFormulario(true)
  }

  // Abrir formulario para editar
  const handleEditar = (cliente) => {
    setForm({
      nombre: cliente.nombre,
      correo: cliente.correo,
      telefono: cliente.telefono,
      empresa: cliente.empresa,
      estado: cliente.estado
    })
    setClienteEditando(cliente.id_cliente)
    setMostrarFormulario(true)
  }

  // Guardar cliente (crear o editar)
  const handleGuardar = async (e) => {
    e.preventDefault()
    try {
      if (clienteEditando) {
        await axios.put(`http://localhost:4000/api/clientes/${clienteEditando}`, form, { headers })
        setMensaje("Cliente actualizado correctamente.")
      } else {
        await axios.post("http://localhost:4000/api/clientes", form, { headers })
        setMensaje("Cliente creado correctamente.")
      }
      setMostrarFormulario(false)
      setError("")
      cargarClientes()
      setTimeout(() => setMensaje(""), 3000)
    } catch (err) {
      setError("Error al guardar cliente.")
    }
  }

  // Eliminar cliente
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este cliente?")) return
    try {
      await axios.delete(`http://localhost:4000/api/clientes/${id}`, { headers })
      setMensaje("Cliente eliminado correctamente.")
      cargarClientes()
      setTimeout(() => setMensaje(""), 3000)
    } catch (err) {
      setError("Error al eliminar cliente.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Gestión de Clientes</h2>
            <p className="text-gray-500 text-sm mt-1">Administra los clientes de TechSolutions</p>
          </div>
          <button
            onClick={handleNuevo}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            + Nuevo Cliente
          </button>
        </div>

        {/* Mensajes */}
        {mensaje && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{mensaje}</div>
        )}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">{error}</div>
        )}

        {/* Formulario */}
        {mostrarFormulario && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              {clienteEditando ? "Editar Cliente" : "Nuevo Cliente"}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
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
                  {clienteEditando ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabla de clientes */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Nombre</th>
                <th className="px-6 py-3 text-left">Correo</th>
                <th className="px-6 py-3 text-left">Teléfono</th>
                <th className="px-6 py-3 text-left">Empresa</th>
                <th className="px-6 py-3 text-left">Estado</th>
                <th className="px-6 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clientes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">
                    No hay clientes registrados
                  </td>
                </tr>
              ) : (
                clientes.map((cliente) => (
                  <tr key={cliente.id_cliente} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">{cliente.nombre}</td>
                    <td className="px-6 py-4 text-gray-600">{cliente.correo}</td>
                    <td className="px-6 py-4 text-gray-600">{cliente.telefono}</td>
                    <td className="px-6 py-4 text-gray-600">{cliente.empresa}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        cliente.estado === "activo"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}>
                        {cliente.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => handleEditar(cliente)}
                        className="bg-yellow-400 text-white px-3 py-1 rounded-lg text-xs hover:bg-yellow-500 transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(cliente.id_cliente)}
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

export default Clientes