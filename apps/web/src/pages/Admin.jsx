// client/src/pages/Admin.jsx
import React, { useState, useEffect } from 'react';
import { Lock, Plus, Pencil, Trash2, X, LogOut } from 'lucide-react';

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null); // null = create, object = edit

  useEffect(() => {
    if (token) {
      fetchServices();
    }
  }, [token]);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const handleSubmitService = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: formData.get('price'),
      category: formData.get('category'),
    };

    const method = currentService ? 'PUT' : 'POST';
    const url = currentService 
      ? `/api/services/${currentService.id}`
      : '/api/services';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        fetchServices();
      } else {
        alert("Error al guardar servicio");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este servicio?")) return;
    
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchServices();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (service = null) => {
    setCurrentService(service);
    setIsModalOpen(true);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#f4ede6] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
              <Lock size={32} />
            </div>
            <h1 className="text-2xl font-bold text-primary">Acceso Administrador</h1>
            <p className="text-gray-500">Ingresa tus credenciales para continuar</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
            >
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4ede6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-3xl font-bold text-primary">Gestión de Servicios</h1>
          <div className="flex gap-4">
            <button
              onClick={() => openModal()}
              className="px-6 py-2 bg-secondary text-primary font-bold rounded-lg hover:bg-white transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus size={20} /> Nuevo Servicio
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 shadow-sm"
            >
              <LogOut size={20} /> Salir
            </button>
          </div>
        </div>

        {/* Services Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-6 py-4 font-semibold">Servicio</th>
                  <th className="px-6 py-4 font-semibold">Categoría</th>
                  <th className="px-6 py-4 font-semibold">Precio</th>
                  <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{service.name}</div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">{service.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs font-bold text-secondary bg-secondary/10 rounded-full">
                        {service.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-700">
                      ${service.price.toLocaleString('es-CL')}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => openModal(service)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(service.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Create/Edit */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl relative animate-fade-in">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-2xl font-bold text-primary mb-6">
                {currentService ? 'Editar Servicio' : 'Nuevo Servicio'}
              </h2>

              <form onSubmit={handleSubmitService} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    required
                    name="name"
                    defaultValue={currentService?.name}
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    required
                    name="description"
                    defaultValue={currentService?.description}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  ></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                    <input
                      required
                      name="price"
                      defaultValue={currentService?.price}
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                    <select
                      name="category"
                      defaultValue={currentService?.category || 'Clínico'}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    >
                      <option value="Clínico">Clínico</option>
                      <option value="Estético">Estético</option>
                      <option value="Ortopedia">Ortopedia</option>
                      <option value="Bienestar">Bienestar</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors mt-4"
                >
                  Guardar
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
