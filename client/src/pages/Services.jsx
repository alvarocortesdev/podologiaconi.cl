// client/src/pages/Services.jsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingBag, X, Loader2 } from 'lucide-react';
import clsx from 'clsx';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedServices, setSelectedServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading services:", err);
        setLoading(false);
      });
  }, []);

  const categories = ['Todos', ...new Set(services.map(s => s.category))];

  const filteredServices = selectedCategory === 'Todos'
    ? services
    : services.filter(s => s.category === selectedCategory);

  const toggleService = (service) => {
    if (selectedServices.find(s => s.id === service.id)) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const total = selectedServices.reduce((acc, s) => acc + s.price, 0);

  const handleQuote = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const response = await fetch('http://localhost:3000/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, services: selectedServices })
      });
      
      if (response.ok) {
        setSuccess(true);
        setSelectedServices([]);
        setTimeout(() => {
          setShowModal(false);
          setSuccess(false);
          setFormData({ name: '', email: '', phone: '' });
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      alert("Hubo un error al enviar la cotización.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4ede6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-primary mb-4">Nuestros Servicios</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Selecciona los tratamientos que necesitas y cotiza en línea de manera rápida y sencilla.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={clsx(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                selectedCategory === cat
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-white/80"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-primary w-10 h-10" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
            {filteredServices.map(service => {
              const isSelected = selectedServices.some(s => s.id === service.id);
              return (
                <div 
                  key={service.id} 
                  onClick={() => toggleService(service)}
                  className={clsx(
                    "bg-white rounded-2xl p-6 shadow-sm border-2 cursor-pointer transition-all duration-200 relative overflow-hidden group hover:shadow-lg",
                    isSelected ? "border-secondary" : "border-transparent hover:border-primary/20"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-2 py-1 rounded-md">
                      {service.category}
                    </span>
                    <div className={clsx(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                      isSelected ? "bg-secondary border-secondary" : "border-gray-300"
                    )}>
                      {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">{service.name}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-3">{service.description}</p>
                  <div className="text-lg font-bold text-primary">
                    ${service.price.toLocaleString('es-CL')}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Floating Summary Bar */}
        {selectedServices.length > 0 && (
          <div className="fixed bottom-6 left-0 right-0 px-4 z-40">
            <div className="max-w-4xl mx-auto bg-primary text-white rounded-2xl shadow-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-slide-up">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-xl hidden sm:block">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-300 font-medium">{selectedServices.length} servicios seleccionados</p>
                  <p className="text-xl font-bold">${total.toLocaleString('es-CL')}</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="w-full sm:w-auto px-8 py-3 bg-secondary text-primary font-bold rounded-xl hover:bg-white transition-colors"
              >
                Solicitar Cotización
              </button>
            </div>
          </div>
        )}

        {/* Modal Form */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl relative animate-fade-in">
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>

              {success ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-2">¡Cotización Enviada!</h3>
                  <p className="text-gray-600">Revisa tu correo, pronto nos pondremos en contacto.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-primary mb-6">Finalizar Cotización</h2>
                  <form onSubmit={handleQuote} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                      <input
                        required
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                      <input
                        required
                        type="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                      <input
                        required
                        type="tel"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg mt-4">
                      <p className="text-sm font-medium text-gray-500 mb-2">Resumen:</p>
                      <ul className="text-sm text-gray-700 space-y-1 mb-3">
                        {selectedServices.map(s => (
                          <li key={s.id} className="flex justify-between">
                            <span>{s.name}</span>
                            <span>${s.price.toLocaleString('es-CL')}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-primary">
                        <span>Total:</span>
                        <span>${total.toLocaleString('es-CL')}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {sending ? <Loader2 className="animate-spin" /> : 'Enviar Cotización'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Helper icons needed for the success state that wasn't imported
function CheckCircle2({ size, className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
