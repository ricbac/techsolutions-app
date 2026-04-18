import { Link, useNavigate, useLocation } from "react-router-dom"

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const token = localStorage.getItem("token")
  const usuario = token ? JSON.parse(atob(token.split(".")[1])) : null
  const esAdmin = usuario?.rol === 1

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  const linkClass = (path) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      location.pathname === path
        ? "bg-white text-blue-600"
        : "text-white hover:bg-blue-500"
    }`

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl"></span>
          <span className="text-white text-xl font-bold">TechSolutions</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className={linkClass("/dashboard")}>
  Dashboard
</Link>
          {esAdmin && (
            <Link to="/usuarios" className={linkClass("/usuarios")}>
            Usuarios
            </Link>
          )}
          {esAdmin && (
            <Link to="/clientes" className={linkClass("/clientes")}>
            Clientes
            </Link>
          )}
          <Link to="/proyectos" className={linkClass("/proyectos")}>
            Proyectos
          </Link>
          <Link to="/tareas" className={linkClass("/tareas")}>
            Tareas
          </Link>
          <button
            onClick={handleLogout}
            className="ml-4 bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar