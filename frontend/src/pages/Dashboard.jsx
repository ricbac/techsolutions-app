import { useEffect, useState } from "react"
import axios from "axios"
import Navbar from "../components/Navbar"
import { Link } from "react-router-dom"

function Dashboard() {
  const [stats, setStats] = useState({
    clientes: 0,
    proyectos: 0,
    tareas: 0,
    tareasCompletadas: 0
  })

  const token = localStorage.getItem("token")
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    const cargarStats = async () => {
      try {
        const [clientes, proyectos, tareas] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/clientes`, { headers }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/proyectos`, { headers }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/tareas`, { headers })
        ])
        setStats({
          clientes: clientes.data.length,
          proyectos: proyectos.data.length,
          tareas: tareas.data.length,
          tareasCompletadas: tareas.data.filter(t => t.estado === "completada").length
        })
      } catch (err) {
        console.error("Error cargando estadísticas", err)
      }
    }
    cargarStats()
  }, [])

  const usuario = JSON.parse(atob(token.split(".")[1]))

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8 max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white mb-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-1">¡Bienvenido, {usuario.nombre}! 👋</h2>
          <p className="text-blue-100">Panel de control — TechSolutions S.A.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Clientes</p>
                <h3 className="text-3xl font-bold text-gray-800">{stats.clientes}</h3>
              </div>
              <span className="text-3xl">👥</span>
            </div>
            <p className="text-xs text-blue-500 mt-3 font-medium">Clientes registrados</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Proyectos</p>
                <h3 className="text-3xl font-bold text-gray-800">{stats.proyectos}</h3>
              </div>
              <span className="text-3xl">📁</span>
            </div>
            <p className="text-xs text-green-500 mt-3 font-medium">Proyectos activos</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-yellow-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Tareas</p>
                <h3 className="text-3xl font-bold text-gray-800">{stats.tareas}</h3>
              </div>
              <span className="text-3xl">📋</span>
            </div>
            <p className="text-xs text-yellow-500 mt-3 font-medium">Tareas en sistema</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-purple-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Tareas Completadas</p>
                <h3 className="text-3xl font-bold text-gray-800">{stats.tareasCompletadas}</h3>
              </div>
              <span className="text-3xl">✅</span>
            </div>
            <p className="text-xs text-purple-500 mt-3 font-medium">
              {stats.tareas > 0
                ? `${Math.round((stats.tareasCompletadas / stats.tareas) * 100)}% completado`
                : "Sin tareas aún"}
            </p>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-700 mb-4">Accesos Rápidos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/clientes" className="bg-white rounded-xl shadow p-6 hover:shadow-md transition cursor-pointer border border-gray-100 hover:border-blue-300">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-xl text-2xl">👥</div>
              <div>
                <h4 className="font-semibold text-gray-800">Gestión de Clientes</h4>
                <p className="text-sm text-gray-400">Crear, editar y eliminar clientes</p>
              </div>
            </div>
          </Link>

          <Link to="/proyectos" className="bg-white rounded-xl shadow p-6 hover:shadow-md transition cursor-pointer border border-gray-100 hover:border-green-300">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 text-green-600 p-3 rounded-xl text-2xl">📁</div>
              <div>
                <h4 className="font-semibold text-gray-800">Gestión de Proyectos</h4>
                <p className="text-sm text-gray-400">Administrar proyectos y estados</p>
              </div>
            </div>
          </Link>

          <Link to="/tareas" className="bg-white rounded-xl shadow p-6 hover:shadow-md transition cursor-pointer border border-gray-100 hover:border-yellow-300">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-100 text-yellow-600 p-3 rounded-xl text-2xl">📋</div>
              <div>
                <h4 className="font-semibold text-gray-800">Gestión de Tareas</h4>
                <p className="text-sm text-gray-400">Asignar y dar seguimiento a tareas</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard