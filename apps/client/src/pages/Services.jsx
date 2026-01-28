// client/src/pages/Services.jsx
import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import clsx from "clsx";
import SkeletonCard from "../components/SkeletonCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedServices, setSelectedServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [sending, setSending] = useState(false);
  const [quoteError, setQuoteError] = useState(null);

  // Fallback mock data in case API fails
  const mockServices = [
    {
      id: 1,
      name: "Atención Podológica General",
      description:
        "Incluye corte y pulido de uñas, eliminación de durezas y masaje podal.",
      price: 25000,
      category: "Clínico",
    },
    {
      id: 2,
      name: "Tratamiento de Onicocriptosis",
      description:
        "Manejo especializado de uña encarnada para aliviar el dolor y prevenir infecciones.",
      price: 30000,
      category: "Clínico",
    },
    {
      id: 3,
      name: "Podología Geriátrica",
      description:
        "Cuidado especializado para pies de adultos mayores, enfocado en movilidad y confort.",
      price: 28000,
      category: "Clínico",
    },
    {
      id: 4,
      name: "Reflexología Podal",
      description:
        "Terapia de masajes en puntos reflejos del pie para promover el bienestar general.",
      price: 35000,
      category: "Bienestar",
    },
    {
      id: 5,
      name: "Esmaltado Permanente",
      description:
        "Luce uñas perfectas por más tiempo con nuestra técnica de esmaltado de larga duración.",
      price: 15000,
      category: "Estético",
    },
    {
      id: 6,
      name: "Ortesis de Silicona",
      description:
        "Dispositivos personalizados para corregir deformidades y aliviar la presión en los dedos.",
      price: 40000,
      category: "Ortopedia",
    },
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/services");

        if (!response.ok) {
          throw new Error(`Error al cargar servicios: ${response.status}`);
        }

        const data = await response.json();

        // Validate that we received an array
        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
        } else {
          // If API returns empty array or invalid data, use fallback
          console.warn("API returned empty or invalid data, using fallback");
          setServices(mockServices);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        // Use fallback mock data if API fails
        setServices(mockServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [mockServices]);

  const categories = ["Todos", ...new Set(services.map((s) => s.category))];

  const filteredServices =
    selectedCategory === "Todos"
      ? services
      : services.filter((s) => s.category === selectedCategory);

  const toggleService = (service) => {
    if (selectedServices.find((s) => s.id === service.id)) {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  // const total = selectedServices.reduce((acc, s) => acc + s.price, 0);

  const handleQuote = async (e) => {
    e.preventDefault();
    setSending(true);
    setQuoteError(null);

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          services: selectedServices.map((s) => ({
            name: s.name,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Error al enviar la cotización" }));
        throw new Error(
          errorData.error || `Error ${response.status}: ${response.statusText}`,
        );
      }

      await response.json();
      toast.success("Cotización Enviada", { position: "bottom-left" });
      setShowModal(false);
      setSelectedServices([]);
      setFormData({ name: "", email: "", phone: "" });
      setQuoteError(null);
    } catch (err) {
      console.error("Error sending quote:", err);
      setQuoteError(
        err.message ||
          "Error al enviar la cotización. Por favor, intenta nuevamente.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-primary mb-4">
            Catálogo de Servicios
          </h1>
          <p className="text-primary/70 max-w-2xl mx-auto text-lg">
            Explora nuestros tratamientos. Selecciona los que necesites y
            solicita una cotización en línea.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={clsx(
                "px-5 py-2 rounded-full text-sm font-bold transition-all duration-300",
                selectedCategory === cat
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-primary/70 hover:bg-white/80 hover:text-primary",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {[...Array(6)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24 animate-fade-in-up">
            {filteredServices.map((service) => {
              const isSelected = selectedServices.some(
                (s) => s.id === service.id,
              );
              return (
                <div
                  key={service.id}
                  onClick={() => toggleService(service)}
                  className={clsx(
                    "bg-white rounded-2xl p-7 shadow-sm border-2 cursor-pointer transition-all duration-300 group hover:shadow-xl hover:-translate-y-1 flex flex-col",
                    isSelected
                      ? "border-secondary shadow-lg"
                      : "border-transparent",
                  )}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-primary w-4/5">
                      {service.name}
                    </h3>
                    <div
                      className={clsx(
                        "w-7 h-7 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all",
                        isSelected
                          ? "bg-secondary border-secondary"
                          : "border-primary/20 bg-primary/5",
                      )}
                    >
                      {isSelected && (
                        <div className="w-3 h-3 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                  <p className="text-primary/70 text-sm mb-5 flex-grow">
                    {service.description}
                  </p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-xs font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-3 py-1.5 rounded-full">
                      {service.category}
                    </span>
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
                  <p className="text-sm text-gray-300 font-medium">
                    {selectedServices.length} servicio(s) seleccionados
                  </p>
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
                onClick={() => {
                  setShowModal(false);
                  setQuoteError(null);
                  setFormData({ name: "", email: "", phone: "" });
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>

              <>
                <h2 className="text-2xl font-bold text-primary mb-2">
                  Finalizar Cotización
                </h2>
                <p className="text-primary/70 mb-6">
                  Completa tus datos para enviarte la cotización detallada.
                </p>
                <form onSubmit={handleQuote} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary/80 mb-1">
                      Nombre Completo{" "}
                      <span className="ml-2 text-xs font-bold text-secondary">
                        Requerido
                      </span>
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-2.5 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all bg-primary/5"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary/80 mb-1">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2.5 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all bg-primary/5"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary/80 mb-1">
                      Teléfono{" "}
                      <span className="ml-2 text-xs font-bold text-secondary">
                        Requerido
                      </span>
                    </label>
                    <input
                      required
                      type="tel"
                      className="w-full px-4 py-2.5 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all bg-primary/5"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>

                  <div className="bg-primary/5 p-4 rounded-lg mt-4">
                    <p className="text-sm font-medium text-primary/60 mb-2">
                      Resumen:
                    </p>
                    <ul className="text-sm text-primary/80 space-y-1 mb-3">
                      {selectedServices.map((s) => (
                        <li key={s.id} className="flex">
                          <span>{s.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {quoteError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                      <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{quoteError}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-opacity-90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {sending ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Enviar Cotización"
                    )}
                  </button>
                </form>
              </>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
