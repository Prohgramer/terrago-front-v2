import { useEffect, useState } from "react";
import { useAuth } from "../routes/AuthProvider";

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Solo admins pueden cargar usuarios
    if (user?.type_user === "admin") {
      fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          setUsers(data.users || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  if (user?.type_user !== "admin") {
    return (
      <div className="max-w-2xl mx-auto py-10 text-center text-red-500">
        No tienes permisos para ver esta página.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Panel de Administración</h1>
      {loading ? (
        <div className="text-center py-10">Cargando usuarios...</div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Usuarios registrados</h2>
          <table className="w-full border rounded-lg overflow-hidden">
            <thead className="bg-neutral-200 dark:bg-neutral-800">
              <tr>
                <th className="p-2">Nombre</th>
                <th className="p-2">Email</th>
                <th className="p-2">Tipo</th>
                <th className="p-2">Último acceso</th>
                <th className="p-2">Conectado</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.type_user}</td>
                  <td className="p-2">{u.last_login ? new Date(u.last_login).toLocaleString() : "Nunca"}</td>
                  <td className="p-2">
                    {u.is_online ? (
                      <span className="text-green-600 font-bold">● Conectado</span>
                    ) : (
                      <span className="text-gray-400">Desconectado</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Aquí puedes agregar más secciones: estadísticas, gestión de terrenos, etc. */}
    </div>
  );
};