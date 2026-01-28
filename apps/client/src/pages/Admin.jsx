import React, { useState, useEffect } from 'react';
import { Lock, Plus, Pencil, Trash2, X, LogOut, Loader2, CheckCircle, Mail, Key } from 'lucide-react';
import clsx from 'clsx';

export default function Admin() {
  // Auth State: 'LOGIN' | 'SETUP' | '2FA' | 'DASHBOARD'
  const [authState, setAuthState] = useState('LOGIN');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [tempToken, setTempToken] = useState(null);
  
  // Login Form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Setup Form
  const [email, setEmail] = useState('');
  const [setupCode, setSetupCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  // 2FA Form
  const [twoFactorCode, setTwoFactorCode] = useState('');

  // General UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Dashboard Data
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);

  useEffect(() => {
    if (token) {
      setAuthState('DASHBOARD');
      fetchServices();
    }
  }, [token]);

  const fetchServices = async () => {
    try {
      setServicesLoading(true);
      setError(null);
      const response = await fetch('/api/services');
      
      if (!response.ok) {
        throw new Error(`Error al cargar servicios: ${response.status}`);
      }
      
      const data = await response.json();
      setServices(data);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err.message);
    } finally {
      setServicesLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      if (data.status === 'SETUP_REQUIRED') {
        setTempToken(data.token);
        setAuthState('SETUP');
        setSuccessMsg('Por seguridad, debes configurar tu cuenta.');
      } else if (data.status === '2FA_REQUIRED') {
        setTempToken(data.token);
        setAuthState('2FA');
        setSuccessMsg('Hemos enviado un código de verificación a tu correo.');
      } else if (data.token) {
        // Fallback for unexpected direct login
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setAuthState('DASHBOARD');
      }
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  const handleSendSetupCode = async () => {
    if (!email || !email.includes('@')) {
      setError('Ingresa un correo válido');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tempToken}`
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al enviar código');
      }

      setCodeSent(true);
      setSuccessMsg(`Código enviado a ${email}. Revisa tu bandeja de entrada.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSetup = async (e) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (setupCode.length !== 8) {
      setError('El código debe tener 8 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/setup', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tempToken}`
        },
        body: JSON.stringify({ email, code: setupCode, newPassword }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error en la configuración');
      }

      setAuthState('LOGIN');
      setTempToken(null);
      setUsername('');
      setPassword('');
      setSuccessMsg('Configuración exitosa. Inicia sesión con tu nueva contraseña.');
      // Reset setup fields
      setEmail('');
      setSetupCode('');
      setNewPassword('');
      setConfirmPassword('');
      setCodeSent(false);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tempToken}`
        },
        body: JSON.stringify({ code: twoFactorCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Código inválido');
      }

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setAuthState('DASHBOARD');
      setTempToken(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setAuthState('LOGIN');
    setUsername('');
    setPassword('');
  };

  // --- CRUD Handlers (Same as before) ---
  const handleSubmitService = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData(e.target);
      const data = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price')),
        category: formData.get('category'),
      };

      const url = currentService 
        ? `/api/services/${currentService.id}`
        : '/api/services';
      
      const method = currentService ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Error al ${currentService ? 'actualizar' : 'crear'} servicio`);
      }

      await fetchServices();
      setIsModalOpen(false);
      setCurrentService(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este servicio?")) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al eliminar servicio');
      }

      await fetchServices();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (service = null) => {
    setCurrentService(service);
    setIsModalOpen(true);
    setError(null);
  };

  // --- RENDER VIEWS ---

  if (authState === 'LOGIN') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-primary/10">
          <div className="text-center mb-8">
            <div className="bg-secondary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
              <Lock size={32} />
            </div>
            <h1 className="text-3xl font-bold font-display text-primary">Área Privada</h1>
            <p className="text-primary/70 mt-2">Ingresa tus credenciales para administrar.</p>
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
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {successMsg}
              </div>
            )}
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

  if (authState === 'SETUP') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg border border-primary/10">
          <div className="text-center mb-8">
            <div className="bg-secondary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
              <Key size={32} />
            </div>
            <h1 className="text-2xl font-bold font-display text-primary">Configuración Inicial</h1>
            <p className="text-primary/70 mt-2">Es tu primer ingreso. Configura tu cuenta para continuar.</p>
          </div>
          
          <form onSubmit={handleSetup} className="space-y-5">
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="block text-sm font-bold text-primary/80 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none transition-all bg-primary/5"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  disabled={codeSent}
                />
              </div>
              <button
                type="button"
                onClick={handleSendSetupCode}
                disabled={loading || codeSent || !email}
                className="px-4 py-3 bg-secondary text-primary font-bold rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 h-[50px]"
              >
                {codeSent ? 'Enviado' : 'Validar'}
              </button>
            </div>

            <div>
              <label className="block text-sm font-bold text-primary/80 mb-1">Código de Verificación (8 dígitos)</label>
              <input
                type="text"
                maxLength={8}
                className={clsx(
                  "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary outline-none transition-all bg-primary/5 font-mono text-center tracking-widest uppercase",
                  setupCode.length === 8 ? "border-green-500 bg-green-50" : "border-primary/20",
                  !setupCode && "border-red-300 placeholder-red-300"
                )}
                value={setupCode}
                onChange={(e) => setSetupCode(e.target.value.toUpperCase())}
                placeholder="XXXXXXXX"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-primary/80 mb-1">Nueva Contraseña</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none transition-all bg-primary/5"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary/80 mb-1">Repetir Contraseña</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none transition-all bg-primary/5"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {successMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !codeSent || setupCode.length !== 8}
              className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-opacity-90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Guardar y Continuar'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (authState === '2FA') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-primary/10">
          <div className="text-center mb-8">
            <div className="bg-secondary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
              <Mail size={32} />
            </div>
            <h1 className="text-2xl font-bold font-display text-primary">Verificación de Identidad</h1>
            <p className="text-primary/70 mt-2">Ingresa el código que enviamos a tu correo.</p>
          </div>
          
          <form onSubmit={handleVerify2FA} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-primary/80 mb-1">Código de 8 dígitos</label>
              <input
                type="text"
                maxLength={8}
                className="w-full px-4 py-3 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none transition-all bg-primary/5 font-mono text-center tracking-widest uppercase text-2xl"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.toUpperCase())}
                placeholder="XXXXXXXX"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading || twoFactorCode.length !== 8}
              className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-opacity-90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Verificar y Entrar'}
            </button>
            
            <button
              type="button"
              onClick={() => setAuthState('LOGIN')}
              className="w-full py-2 text-primary/60 hover:text-primary text-sm"
            >
              Volver al inicio
            </button>
          </form>
        </div>
      </div>
    );
  }

  // DASHBOARD VIEW (Existing code wrapped)
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
              title="Cerrar Sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-primary/10">
          {servicesLoading ? (
            <div className="p-12 text-center">
              <Loader2 className="animate-spin mx-auto text-primary mb-4" size={32} />
              <p className="text-primary/70">Cargando servicios...</p>
            </div>
          ) : (
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
                  {services.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-primary/60">
                        No hay servicios disponibles. Crea uno nuevo para comenzar.
                      </td>
                    </tr>
                  ) : (
                    services.map((service) => (
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
                            className="p-2 text-primary/70 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-primary text-white flex justify-between items-center">
              <h2 className="text-xl font-bold font-display">
                {currentService ? 'Editar Servicio' : 'Nuevo Servicio'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitService} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-primary/80 mb-1">Nombre</label>
                <input
                  name="name"
                  defaultValue={currentService?.name}
                  required
                  className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-primary/80 mb-1">Descripción</label>
                <textarea
                  name="description"
                  defaultValue={currentService?.description}
                  rows="3"
                  className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-primary/80 mb-1">Precio</label>
                  <input
                    name="price"
                    type="number"
                    defaultValue={currentService?.price}
                    required
                    className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary/80 mb-1">Categoría</label>
                  <select
                    name="category"
                    defaultValue={currentService?.category || 'Clínico'}
                    className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none bg-white"
                  >
                    <option value="Clínico">Clínico</option>
                    <option value="Estético">Estético</option>
                    <option value="Ortopedia">Ortopedia</option>
                    <option value="Bienestar">Bienestar</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 text-primary/70 hover:bg-gray-100 rounded-lg font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-secondary text-primary font-bold rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : (currentService ? 'Actualizar' : 'Guardar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}