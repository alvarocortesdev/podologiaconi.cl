// client/src/pages/Services.jsx
import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, Loader2, CheckCircle } from 'lucide-react';
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
    // Mock data for demonstration
    const mockServices = [
      { id: 1, name: 'Atención Podológica General', description: 'Incluye corte y pulido de uñas, eliminación de durezas y masaje podal.', price: 25000, category: 'Clínico' },
      { id: 2, name: 'Tratamiento de Onicocriptosis', description: 'Manejo especializado de uña encarnada para aliviar el dolor y prevenir infecciones.', price: 30000, category: 'Clínico' },
      { id: 3, name: 'Podología Geriátrica', description: 'Cuidado especializado para pies de adultos mayores, enfocado en movilidad y confort.', price: 28000, category: 'Clínico' },
      { id: 4, name: 'Reflexología Podal', description: 'Terapia de masajes en puntos reflejos del pie para promover el bienestar general.', price: 35000, category: 'Bienestar' },
      { id: 5, name: 'Esmaltado Permanente', description: 'Luce uñas perfectas por más tiempo con nuestra técnica de esmaltado de larga duración.', price: 15000, category: 'Estético' },
      { id: 6, name: 'Ortesis de Silicona', description: 'Dispositivos personalizados para corregir deformidades y aliviar la presión en los dedos.', price: 40000, category: 'Ortopedia' },
    ];
    setServices(mockServices);
    setLoading(false);
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
    // Mock API call
    console.log("Sending quote:", { ...formData, services: selectedServices });
    setTimeout(() => {
      setSuccess(true);
      setSelectedServices([]);
      setSending(false);
      setTimeout(() => {
        setShowModal(false);
        setSuccess(false);
        setFormData({ name: '', email: '', phone: '' });
      }, 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-primary mb-4">Catálogo de Servicios</h1>
          <p className="text-primary/70 max-w-2xl mx-auto text-lg">
            Explora nuestros tratamientos. Selecciona los que necesites y solicita una cotización en línea.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={clsx(
                "px-5 py-2 rounded-full text-sm font-bold transition-all duration-300",
                selectedCategory === cat
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-primary/70 hover:bg-white/80 hover:text-primary"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-primary w-12 h-12" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {filteredServices.map(service => {
              const isSelected = selectedServices.some(s => s.id === service.id);
              return (
                <div 
                  key={service.id} 
                  onClick={() => toggleService(service)}
                  className={clsx(
                    "bg-white rounded-2xl p-7 shadow-sm border-2 cursor-pointer transition-all duration-300 group hover:shadow-xl hover:-translate-y-1 flex flex-col",
                    isSelected ? "border-secondary shadow-lg" : "border-transparent"
                  )}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-primary w-4/5">{service.name}</h3>
                    <div className={clsx(
                      "w-7 h-7 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all",
                      isSelected ? "bg-secondary border-secondary" : "border-primary/20 bg-primary/5"
                    )}>
                      {isSelected && <div className="w-3 h-3 bg-white rounded-full" />}
                    </div>
                  </div>
                  <p className="text-primary/70 text-sm mb-5 flex-grow">{service.description}</p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-xs font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-3 py-1.5 rounded-full">
                      {service.category}
                    </span>
                    <div className="text-xl font-bold text-primary">
                      ${service.price.toLocaleString('es-CL')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Floating Summary Bar */}
        {selectedServices.length > 0 && (
          <div className="fixed bottom-6 inset-x-0 px-4 z-40">
            <div className="max-w-2xl mx-auto bg-primary text-white rounded-2xl shadow-2xl p-4 flex items-center justify-between gap-4 animate-slide-up">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-3 rounded-xl hidden sm:block">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-300 font-medium">{selectedServices.length} servicio(s) seleccionado(s)</p>
                  <p className="text-xl font-bold">${total.toLocaleString('es-CL')}</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex-shrink-0 px-6 py-3 bg-secondary text-primary font-bold rounded-xl hover:bg-opacity-90 transition-colors"
              >
                Cotizar
              </button>
            </div>
          </div>
        )}

        {/* Modal Form */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl relative animate-fade-in-up">
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>

              {success ? (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-2">¡Cotización Enviada!</h3>
                  <p className="text-primary/70">Gracias por tu interés. Revisa tu correo, pronto nos pondremos en contacto.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-primary mb-2">Finalizar Cotización</h2>
                  <p className="text-primary/70 mb-6">Completa tus datos para enviarte la cotización detallada.</p>
                  <form onSubmit={handleQuote} className="space-y-4">
                    {['Nombre Completo', 'Correo Electrónico', 'Teléfono'].map((label, i) => (
                      <div key={i}>
                        <label className="block text-sm font-medium text-primary/80 mb-1">{label}</label>
                        <input
                          required
                          type={i === 1 ? 'email' : (i === 2 ? 'tel' : 'text')}
                          className="w-full px-4 py-2.5 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all bg-primary/5"
                          value={Object.values(formData)[i]}
                          onChange={e => setFormData({...formData, [Object.keys(formData)[i]]: e.target.value})}
                        />
                      </div>
                    ))}

                    <div className="bg-primary/5 p-4 rounded-lg mt-4">
                      <p className="text-sm font-medium text-primary/60 mb-2">Resumen:</p>
                      <ul className="text-sm text-primary/80 space-y-1 mb-3">
                        {selectedServices.map(s => (
                          <li key={s.id} className="flex justify-between">
                            <span>{s.name}</span>
                            <span className="font-medium">${s.price.toLocaleString('es-CL')}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t border-primary/10 pt-2 flex justify-between font-bold text-primary text-base">
                        <span>Total:</span>
                        <span>${total.toLocaleString('es-CL')}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-opacity-90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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
