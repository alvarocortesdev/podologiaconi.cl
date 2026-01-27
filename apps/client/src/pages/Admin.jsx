// client/src/pages/Admin.jsx
import React, { useState, useEffect } from 'react';
import { Lock, Plus, Pencil, Trash2, X, LogOut, Loader2 } from 'lucide-react';

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);

  useEffect(() => {
    if (token) {
      fetchServices();
    }
  }, [token]);

  const fetchServices = async () => {
    // Mock data for demonstration
    const mockServices = [
      { id: 1, name: 'Atención Podológica General', description: 'Corte y pulido de uñas, etc.', price: 25000, category: 'Clínico' },
      { id: 2, name: 'Tratamiento Onicocriptosis', description: 'Manejo de uña encarnada.', price: 30000, category: 'Clínico' },
      { id: 3, name: 'Reflexología Podal', description: 'Terapia de masajes.', price: 35000, category: 'Bienestar' },
    ];
    setServices(mockServices);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Mock login
    setTimeout(() => {
      if (username === 'admin' && password === 'password') {
        const fakeToken = 'fake-jwt-token';
        localStorage.setItem('token', fakeToken);
        setToken(fakeToken);
      } else {
        alert('Credenciales incorrectas (use admin/password)');
      }
      setLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const handleSubmitService = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      id: currentService ? currentService.id : Date.now(),
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseInt(formData.get('price'), 10),
      category: formData.get('category'),
    };

    if (currentService) {
      setServices(services.map(s => s.id === data.id ? data : s));
    } else {
      setServices([...services, data]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este servicio?")) return;
    setServices(services.filter(s => s.id !== id));
  };

  const openModal = (service = null) => {
    setCurrentService(service);
    setIsModalOpen(true);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-primary/10">
          <div className="text-center mb-8">
            <div className="bg-secondary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
              <Lock size={32} />
            </div>
            <h1 className="text-3xl font-bold font-display text-primary">Área Privada</h1>
            <p className="text-primary/70 mt-2">Ingresa tus credenciales para administrar los servicios.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-primary/80 mb-1">Usuario</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none transition-all bg-primary/5"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-primary/80 mb-1">Contraseña</label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none transition-all bg-primary/5"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-opacity-90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display text-primary">Gestión de Servicios</h1>
            <p className="text-primary/70 mt-1">Añade, edita o elimina servicios del catálogo.</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => openModal()}
              className="px-5 py-2.5 bg-secondary text-primary font-bold rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus size={20} /> Nuevo Servicio
            </button>
            <button
              onClick={handleLogout}
              className="p-3 bg-white text-primary rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors flex items-center gap-2 shadow-sm border border-primary/10"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-primary/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-primary/5 border-b border-primary/10">
                <tr>
                  <th className="px-6 py-4 font-bold text-primary">Servicio</th>
                  <th className="hidden sm:table-cell px-6 py-4 font-bold text-primary">Categoría</th>
                  <th className="hidden lg:table-cell px-6 py-4 font-bold text-primary">Precio</th>
                  <th className="px-6 py-4 font-bold text-primary text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-primary">{service.name}</div>
                      <div className="text-sm text-primary/60 max-w-xs truncate">{service.description}</div>
                      <div className="sm:hidden mt-2">
                        <span className="px-3 py-1 text-xs font-bold text-secondary bg-secondary/10 rounded-full">
                          {service.category}
                        </span>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 align-middle">
                      <span className="px-3 py-1 text-xs font-bold text-secondary bg-secondary/10 rounded-full">
                        {service.category}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 font-medium text-primary/80 align-middle">
                      ${service.price.toLocaleString('es-CL')}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 align-middle">
                      <button 
                        onClick={() => openModal(service)}
                        className="p-2 text-primary/70 hover:bg-secondary/20 hover:text-primary rounded-lg transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(service.id)}
                        className="p-2 text-red-600/70 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
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

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl relative animate-fade-in-up">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-2xl font-bold font-display text-primary mb-6">
                {currentService ? 'Editar Servicio' : 'Crear Nuevo Servicio'}
              </h2>

              <form onSubmit={handleSubmitService} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-primary/80 mb-1">Nombre</label>
                  <input required name="name" defaultValue={currentService?.name} type="text" className="w-full px-4 py-2.5 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none bg-primary/5"/>
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary/80 mb-1">Descripción</label>
                  <textarea required name="description" defaultValue={currentService?.description} rows="3" className="w-full px-4 py-2.5 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none bg-primary/5"></textarea>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-primary/80 mb-1">Precio</label>
                    <input required name="price" defaultValue={currentService?.price} type="number" className="w-full px-4 py-2.5 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none bg-primary/5"/>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-primary/80 mb-1">Categoría</label>
                    <select name="category" defaultValue={currentService?.category || 'Clínico'} className="w-full px-4 py-2.5 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none bg-primary/5">
                      <option>Clínico</option>
                      <option>Estético</option>
                      <option>Ortopedia</option>
                      <option>Bienestar</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-opacity-90 transition-colors"
                >
                  {currentService ? 'Guardar Cambios' : 'Crear Servicio'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
