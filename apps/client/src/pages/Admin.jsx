import React, { useState, useEffect, useCallback } from "react";
import ImageUpload from "../components/ImageUpload";
import SortableCard from "../components/SortableCard";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Lock,
  Plus,
  Pencil,
  Trash2,
  X,
  LogOut,
  Loader2,
  CheckCircle,
  Check,
  Mail,
  Key,
  Layout,
  Settings,
  Image as ImageIcon,
  FileText,
  AlertCircle,
  Globe,
  User,
  Phone,
  Instagram,
  Eye,
  EyeOff,
  Menu,
} from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import clsx from "clsx";

export default function Admin() {
  // Auth State: 'LOGIN' | 'SETUP' | '2FA' | 'DASHBOARD'
  const [authState, setAuthState] = useState("LOGIN");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [tempToken, setTempToken] = useState(null);

  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState("CONFIG"); // SERVICES | CONFIG | SUCCESS_CASES
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Login Form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Setup Form
  const [email, setEmail] = useState("");
  const [setupCode, setSetupCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  // 2FA Form
  const [twoFactorCode, setTwoFactorCode] = useState("");

  // General UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Data State
  const [services, setServices] = useState([]);
  const [siteConfig, setSiteConfig] = useState(null);
  const [successCases, setSuccessCases] = useState([]);
  const [aboutCards, setAboutCards] = useState([]);

  // Image States for Forms
  const [configAboutImage, setConfigAboutImage] = useState(null);
  const [caseImageBefore, setCaseImageBefore] = useState(null);
  const [caseImageAfter, setCaseImageAfter] = useState(null);
  const [caseDescription, setCaseDescription] = useState("");

  // Modals & Current Items
  const [servicesLoading, setServicesLoading] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);

  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [currentCase, setCurrentCase] = useState(null);

  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Profile State
  const [emailStep, setEmailStep] = useState("REQUEST"); // REQUEST | CONFIRM
  const [pendingEmail, setPendingEmail] = useState("");

  const fetchServices = useCallback(async () => {
    try {
      setServicesLoading(true);
      const response = await fetch("/api/services");
      if (!response.ok) throw new Error("Error loading services");
      setServices(await response.json());
    } catch (err) {
      console.error(err);
    } finally {
      setServicesLoading(false);
    }
  }, []);

  const fetchConfig = useCallback(async () => {
    try {
      const response = await fetch("/api/config");
      if (response.ok) setSiteConfig(await response.json());
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchSuccessCases = useCallback(async () => {
    try {
      const response = await fetch("/api/success-cases");
      if (response.ok) setSuccessCases(await response.json());
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchAboutCards = useCallback(async () => {
    try {
      const response = await fetch("/api/about-cards");
      if (response.ok) setAboutCards(await response.json());
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchAllData = useCallback(() => {
    fetchServices();
    fetchConfig();
    fetchSuccessCases();
    fetchAboutCards();
  }, [fetchServices, fetchConfig, fetchSuccessCases, fetchAboutCards]);

  useEffect(() => {
    if (token) {
      setAuthState("DASHBOARD");
      fetchAllData();
    }
  }, [token, fetchAllData]);

  useEffect(() => {
    if (siteConfig?.aboutImage) {
      setConfigAboutImage(siteConfig.aboutImage);
    }
  }, [siteConfig]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
      }

      if (data.status === "SETUP_REQUIRED") {
        setTempToken(data.token);
        setAuthState("SETUP");
        setSuccessMsg("Por seguridad, debes configurar tu cuenta.");
      } else if (data.status === "2FA_REQUIRED") {
        setTempToken(data.token);
        setAuthState("2FA");
        // setSuccessMsg("Hemos enviado un código de verificación a tu correo."); // Removed as requested
      } else if (data.token) {
        // Fallback for unexpected direct login
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setAuthState("DASHBOARD");
      }
    } catch (err) {
      setError(err.message || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  const handleSendSetupCode = async () => {
    if (!email || !email.includes("@")) {
      setError("Ingresa un correo válido");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tempToken}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al enviar código");
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
      setError("Las contraseñas no coinciden");
      return;
    }
    if (setupCode.length !== 8) {
      setError("El código debe tener 8 caracteres");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tempToken}`,
        },
        body: JSON.stringify({ email, code: setupCode, newPassword }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error en la configuración");
      }

      setAuthState("LOGIN");
      setTempToken(null);
      setUsername("");
      setPassword("");
      setSuccessMsg(
        "Configuración exitosa. Inicia sesión con tu nueva contraseña.",
      );
      // Reset setup fields
      setEmail("");
      setSetupCode("");
      setNewPassword("");
      setConfirmPassword("");
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
      const response = await fetch("/api/auth/verify-2fa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tempToken}`,
        },
        body: JSON.stringify({ code: twoFactorCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Código inválido");
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setAuthState("DASHBOARD");
      setTempToken(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthState("LOGIN");
    setUsername("");
    setPassword("");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  // Profile Handlers
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      if (data.newPassword !== data.confirmPassword)
        throw new Error("Las contraseñas no coinciden");

      const response = await fetch("/api/admin/profile/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error || "Error al actualizar contraseña");
      }
      setSuccessMsg("Contraseña actualizada correctamente");
      e.target.reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestEmailChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const response = await fetch("/api/admin/profile/email-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newEmail: pendingEmail }),
      });
      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error || "Error al solicitar cambio");
      }
      setEmailStep("CONFIRM");
      setSuccessMsg("Código enviado al nuevo correo");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmEmailChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData(e.target);
      const code = formData.get("code");

      const response = await fetch("/api/admin/profile/email-confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      });
      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error || "Error al confirmar cambio");
      }
      setSuccessMsg("Correo actualizado. Por favor inicia sesión nuevamente.");
      setTimeout(handleLogout, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- CRUD Handlers ---

  // Services
  const handleSubmitService = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.target);
      const data = {
        name: formData.get("name"),
        description: formData.get("description"),
        price: parseFloat(formData.get("price")),
        category: formData.get("category"),
        showPrice: formData.get("showPrice") === "on",
      };

      const url = currentService
        ? `/api/services/${currentService.id}`
        : "/api/services";

      const method = currentService ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Error al guardar servicio");

      await fetchServices();
      setIsServiceModalOpen(false);
      setCurrentService(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este servicio?")) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error al eliminar");
      await fetchServices();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openServiceModal = (service = null) => {
    setCurrentService(service);
    setIsServiceModalOpen(true);
    setError(null);
  };

  // Config
  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      // Use state for image if set (or null if removed)
      // Note: If configAboutImage is null but siteConfig.aboutImage exists,
      // we need to know if the user explicitly removed it or just didn't touch it.
      // But we initialize configAboutImage with siteConfig.aboutImage.
      // So if configAboutImage is null, it means it was removed or never existed.
      // However, if the component wasn't touched, configAboutImage might not have triggered onChange?
      // No, we set it in useEffect. So configAboutImage IS the source of truth.
      if (configAboutImage !== undefined) {
        data.aboutImage = configAboutImage;
      }

      const response = await fetch("/api/config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Error al guardar configuración");

      const updated = await response.json();
      setSiteConfig(updated);
      setSuccessMsg("Configuración actualizada correctamente");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Success Cases
  const handleSubmitCase = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      // Use state for images
      data.imageBefore = caseImageBefore;
      data.imageAfter = caseImageAfter;
      data.description = caseDescription;
      data.isVisible = formData.get("isVisible") === "on";

      const url = currentCase
        ? `/api/success-cases/${currentCase.id}`
        : "/api/success-cases";

      const method = currentCase ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Error al guardar caso");

      await fetchSuccessCases();
      setIsCaseModalOpen(false);
      setCurrentCase(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCase = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este caso?")) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/success-cases/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error al eliminar");
      await fetchSuccessCases();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openCaseModal = (item = null) => {
    setCurrentCase(item);
    setCaseImageBefore(item?.imageBefore || null);
    setCaseImageAfter(item?.imageAfter || null);
    setCaseDescription(item?.description || "");
    setIsCaseModalOpen(true);
    setError(null);
  };

  // About Cards
  const handleSaveCard = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      const url = currentCard
        ? `/api/about-cards/${currentCard.id}`
        : "/api/about-cards";

      const method = currentCard ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Error al guardar tarjeta");

      await fetchAboutCards();
      setIsCardModalOpen(false);
      setCurrentCard(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta tarjeta?")) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/about-cards/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error al eliminar tarjeta");
      await fetchAboutCards();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = aboutCards.findIndex((item) => item.id === active.id);
      const newIndex = aboutCards.findIndex((item) => item.id === over.id);

      const newOrder = arrayMove(aboutCards, oldIndex, newIndex);
      setAboutCards(newOrder);

      // Save new order
      try {
        const orderUpdates = newOrder.map((card, index) => ({
          id: card.id,
          order: index,
        }));

        const response = await fetch("/api/about-cards/reorder", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cards: orderUpdates }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Reorder error data:", errorData);
          throw new Error(
            errorData.details || errorData.error || "Failed to save order",
          );
        }
      } catch (err) {
        console.error("Error updating order:", err);
        fetchAboutCards();
      }
    }
  };

  const openCardModal = (card = null) => {
    setCurrentCard(card);
    setIsCardModalOpen(true);
    setError(null);
  };

  // --- TOGGLE HANDLERS ---

  useEffect(() => {
    const shouldLock = isServiceModalOpen || isCaseModalOpen || isCardModalOpen;
    document.body.style.overflow = shouldLock ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isServiceModalOpen, isCaseModalOpen, isCardModalOpen]);

  const toggleGlobalPrices = async () => {
    if (!siteConfig) return;
    try {
      const newShowPrices = !siteConfig.showPrices;
      // Optimistic update
      setSiteConfig({ ...siteConfig, showPrices: newShowPrices });

      const response = await fetch("/api/config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...siteConfig, showPrices: newShowPrices }),
      });

      if (!response.ok) {
        // Revert on error
        setSiteConfig(siteConfig);
        throw new Error("Error updating global price setting");
      }

      const updated = await response.json();
      setSiteConfig(updated);
    } catch (err) {
      console.error(err);
      setError("Error al actualizar configuración de precios");
    }
  };

  const toggleServiceVisibility = async (service) => {
    try {
      // Optimistic update
      setServices(
        services.map((s) =>
          s.id === service.id ? { ...s, isVisible: !s.isVisible } : s,
        ),
      );

      const response = await fetch(`/api/services/${service.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isVisible: !service.isVisible }),
      });

      if (!response.ok) {
        throw new Error("Error updating service visibility");
      }
    } catch (err) {
      console.error(err);
      fetchServices(); // Revert/Refresh
    }
  };

  const toggleCaseVisibility = async (item) => {
    try {
      // Optimistic update
      setSuccessCases(
        successCases.map((c) =>
          c.id === item.id ? { ...c, isVisible: !c.isVisible } : c,
        ),
      );

      const response = await fetch(`/api/success-cases/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isVisible: !item.isVisible }),
      });

      if (!response.ok) {
        throw new Error("Error updating case visibility");
      }
    } catch (err) {
      console.error(err);
      fetchSuccessCases(); // Revert/Refresh
    }
  };

  // --- RENDER VIEWS ---

  if (authState === "LOGIN") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl w-full max-w-md border border-primary/10">
          <div className="text-center mb-8">
            <div className="bg-secondary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
              <Lock size={32} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-primary">
              Área Privada
            </h1>
            <p className="text-primary/70 mt-2">
              Ingresa tus credenciales para administrar.
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-primary/80 mb-1">
                Usuario
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none transition-all bg-primary/5"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-primary/80 mb-1">
                Contraseña
              </label>
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
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (authState === "SETUP") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl w-full max-w-lg border border-primary/10">
          <div className="text-center mb-8">
            <div className="bg-secondary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
              <Key size={32} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-display text-primary">
              Configuración Inicial
            </h1>
            <p className="text-primary/70 mt-2">
              Es tu primer ingreso. Configura tu cuenta para continuar.
            </p>
          </div>

          <form onSubmit={handleSetup} className="space-y-5">
            <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
              <div className="flex-1">
                <label className="block text-sm font-bold text-primary/80 mb-1">
                  Correo Electrónico
                </label>
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
                className="px-4 py-3 bg-secondary text-primary font-bold rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 h-[50px] w-full sm:w-auto"
              >
                {codeSent ? "Enviado" : "Validar"}
              </button>
            </div>

            <div>
              <label className="block text-sm font-bold text-primary/80 mb-1">
                Código de Verificación (8 dígitos)
              </label>
              <input
                type="text"
                maxLength={8}
                className={clsx(
                  "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary outline-none transition-all bg-primary/5 font-mono text-center tracking-widest uppercase",
                  setupCode.length === 8
                    ? "border-green-500 bg-green-50"
                    : "border-primary/20",
                  !setupCode && "border-red-300 placeholder-red-300",
                )}
                value={setupCode}
                onChange={(e) => setSetupCode(e.target.value.toUpperCase())}
                placeholder="XXXXXXXX"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-primary/80 mb-1">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none transition-all bg-primary/5"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary/80 mb-1">
                  Repetir Contraseña
                </label>
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
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Guardar y Continuar"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (authState === "2FA") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl w-full max-w-md border border-primary/10">
          <div className="text-center mb-8">
            <div className="bg-secondary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
              <Mail size={32} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-display text-primary">
              Verificación de Identidad
            </h1>
            <p className="text-primary/70 mt-2">
              Ingresa el código que enviamos a tu correo.
            </p>
          </div>

          <form onSubmit={handleVerify2FA} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-primary/80 mb-1">
                Código de 8 dígitos
              </label>
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
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Verificar y Entrar"
              )}
            </button>

            <button
              type="button"
              onClick={() => setAuthState("LOGIN")}
              className="w-full py-2 text-primary/60 hover:text-primary text-sm"
            >
              Volver al inicio
            </button>
          </form>
        </div>
      </div>
    );
  }

  // DASHBOARD VIEW
  return (
    <div className="min-h-screen bg-background flex font-sans overflow-x-hidden">
      <aside className="hidden md:flex w-64 bg-white border-r border-primary/10 h-screen sticky top-0 flex-col z-30 shadow-lg flex-shrink-0">
        <div className="p-6 border-b border-primary/10">
          <h1 className="text-xl font-bold font-display text-primary">
            Admin v.1.2.0
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => handleTabChange("CONFIG")}
            className={clsx(
              "flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all text-left font-medium",
              activeTab === "CONFIG"
                ? "bg-secondary text-primary shadow-md font-bold"
                : "text-primary/70 hover:bg-primary/5",
            )}
          >
            <Settings size={20} /> Configuración
          </button>
          <button
            onClick={() => handleTabChange("SUCCESS_CASES")}
            className={clsx(
              "flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all text-left font-medium",
              activeTab === "SUCCESS_CASES"
                ? "bg-secondary text-primary shadow-md font-bold"
                : "text-primary/70 hover:bg-primary/5",
            )}
          >
            <ImageIcon size={20} /> Casos de Éxito
          </button>
          <button
            onClick={() => handleTabChange("SERVICES")}
            className={clsx(
              "flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all text-left font-medium",
              activeTab === "SERVICES"
                ? "bg-secondary text-primary shadow-md font-bold"
                : "text-primary/70 hover:bg-primary/5",
            )}
          >
            <Layout size={20} /> Servicios
          </button>
          <button
            onClick={() => handleTabChange("PROFILE")}
            className={clsx(
              "flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all text-left font-medium",
              activeTab === "PROFILE"
                ? "bg-secondary text-primary shadow-md font-bold"
                : "text-primary/70 hover:bg-primary/5",
            )}
          >
            <Lock size={20} /> Perfil
          </button>
        </nav>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="fixed md:sticky top-0 z-30 w-full bg-white left-0 right-0">
          <header className="h-16 sm:h-20 border-b border-primary/10 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm">
            <div className="font-display font-bold text-lg sm:text-xl text-primary">
              Admin v.1.2.0
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a
                href="/"
                target="_blank"
                className="flex items-center gap-2 text-primary/70 hover:text-secondary font-medium transition-colors"
              >
                <Globe size={20} /> Sitio Web
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium transition-colors"
              >
                <LogOut size={20} /> Cerrar Sesión
              </button>
            </div>
            <div className="flex md:hidden items-center gap-2">
              <a
                href="/"
                target="_blank"
                className="p-2 rounded-lg text-primary/70 hover:text-secondary hover:bg-secondary/10 transition-colors"
                aria-label="Ir al sitio web"
              >
                <Globe size={20} />
              </a>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                aria-label="Cerrar sesión"
              >
                <LogOut size={20} />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="p-2 rounded-lg text-primary/80 hover:text-primary hover:bg-primary/5 transition-colors"
                aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </header>

          <div
            className={clsx(
              "md:hidden absolute left-0 right-0 top-full border-b border-primary/10 bg-white px-4 pb-4 shadow-lg",
              isMobileMenuOpen ? "block" : "hidden",
            )}
          >
            <nav className="pt-4 space-y-2">
              <button
                onClick={() => handleTabChange("CONFIG")}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all text-left font-medium",
                  activeTab === "CONFIG"
                    ? "bg-secondary text-primary shadow-md font-bold"
                    : "text-primary/70 hover:bg-primary/5",
                )}
              >
                <Settings size={20} /> Configuración
              </button>
              <button
                onClick={() => handleTabChange("SUCCESS_CASES")}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all text-left font-medium",
                  activeTab === "SUCCESS_CASES"
                    ? "bg-secondary text-primary shadow-md font-bold"
                    : "text-primary/70 hover:bg-primary/5",
                )}
              >
                <ImageIcon size={20} /> Casos de Éxito
              </button>
              <button
                onClick={() => handleTabChange("SERVICES")}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all text-left font-medium",
                  activeTab === "SERVICES"
                    ? "bg-secondary text-primary shadow-md font-bold"
                    : "text-primary/70 hover:bg-primary/5",
                )}
              >
                <Layout size={20} /> Servicios
              </button>
              <button
                onClick={() => handleTabChange("PROFILE")}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all text-left font-medium",
                  activeTab === "PROFILE"
                    ? "bg-secondary text-primary shadow-md font-bold"
                    : "text-primary/70 hover:bg-primary/5",
                )}
              >
                <Lock size={20} /> Perfil
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 pt-20 sm:pt-24 md:pt-6 lg:p-8 bg-background overflow-y-auto overflow-x-hidden min-w-0">
          {/* SERVICES TAB */}
          {activeTab === "SERVICES" && (
            <div>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-primary">
                  Gestión de Servicios
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">
                  <button
                    onClick={toggleGlobalPrices}
                    className={clsx(
                      "px-4 py-2.5 rounded-lg font-bold transition-colors flex items-center gap-2 border justify-center sm:justify-start",
                      siteConfig?.showPrices
                        ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                        : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200",
                    )}
                  >
                    {siteConfig?.showPrices ? (
                      <>
                        <Eye size={20} /> Precios Visibles
                      </>
                    ) : (
                      <>
                        <EyeOff size={20} /> Precios Ocultos
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => openServiceModal()}
                    className="px-5 py-2.5 bg-secondary text-primary font-bold rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Plus size={20} /> Nuevo Servicio
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-primary/10">
                {servicesLoading ? (
                  <div className="p-12 text-center">
                    <Loader2
                      className="animate-spin mx-auto text-primary mb-4"
                      size={32}
                    />
                    <p className="text-primary/70">Cargando servicios...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-primary/5 border-b border-primary/10">
                        <tr>
                          <th className="px-6 py-4 font-bold text-primary">
                            Servicio
                          </th>
                          <th className="hidden sm:table-cell px-6 py-4 font-bold text-primary">
                            Categoría
                          </th>
                          <th className="hidden lg:table-cell px-6 py-4 font-bold text-primary">
                            Precio
                          </th>
                          <th className="px-6 py-4 font-bold text-primary text-right">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-primary/5">
                        {services.length === 0 ? (
                          <tr>
                            <td
                              colSpan="4"
                              className="px-6 py-12 text-center text-primary/60"
                            >
                              No hay servicios.
                            </td>
                          </tr>
                        ) : (
                          services.map((service) => (
                            <tr
                              key={service.id}
                              className="hover:bg-primary/5 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <div className="font-bold text-primary">
                                  {service.name}
                                </div>
                                <div className="sm:hidden mt-1 text-xs text-secondary font-bold">
                                  {service.category}
                                </div>
                              </td>
                              <td className="hidden sm:table-cell px-6 py-4">
                                <span className="px-3 py-1 text-xs font-bold text-secondary bg-secondary/10 rounded-full">
                                  {service.category}
                                </span>
                              </td>
                              <td className="hidden lg:table-cell px-6 py-4 font-medium text-primary/80">
                                ${service.price.toLocaleString("es-CL")}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex flex-col items-end gap-2">
                                  <button
                                    onClick={() =>
                                      toggleServiceVisibility(service)
                                    }
                                    className={clsx(
                                      "p-2 rounded-lg",
                                      service.isVisible
                                        ? "text-green-600 bg-green-50 hover:bg-green-100"
                                        : "text-gray-400 bg-gray-50 hover:bg-gray-100",
                                    )}
                                    title={
                                      service.isVisible
                                        ? "Ocultar Servicio"
                                        : "Mostrar Servicio"
                                    }
                                  >
                                    {service.isVisible ? (
                                      <Eye size={18} />
                                    ) : (
                                      <EyeOff size={18} />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => openServiceModal(service)}
                                    className="p-2 text-primary/70 hover:bg-secondary/20 hover:text-primary rounded-lg"
                                  >
                                    <Pencil size={18} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteService(service.id)
                                    }
                                    className="p-2 text-primary/70 hover:bg-red-50 hover:text-red-500 rounded-lg"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
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
          )}

          {/* SUCCESS CASES TAB */}
          {activeTab === "SUCCESS_CASES" && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-primary">
                  Casos de Éxito
                </h2>
                <button
                  onClick={() => openCaseModal()}
                  className="px-5 py-2.5 bg-secondary text-primary font-bold rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto"
                >
                  <Plus size={20} /> Nuevo Caso
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {successCases.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden border border-primary/10 flex flex-col"
                  >
                    <div className="h-40 bg-gray-200 relative flex">
                      <div
                        className="w-1/2 h-full bg-cover bg-center border-r border-white/20"
                        style={{ backgroundImage: `url(${item.imageBefore})` }}
                        title="Antes"
                      ></div>
                      <div
                        className="w-1/2 h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${item.imageAfter})` }}
                        title="Después"
                      ></div>
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
                        Antes
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
                        Después
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-lg text-primary mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-primary/70 mb-4 line-clamp-3 flex-1">
                        {item.description
                          ?.replace(/<[^>]+>/g, " ")
                          .replace(/&nbsp;/g, " ")
                          .replace(/\s+/g, " ")
                          .trim()}
                      </p>
                      <div className="flex justify-end gap-2 pt-2 border-t border-primary/5">
                        <button
                          onClick={() => toggleCaseVisibility(item)}
                          className={clsx(
                            "p-2 rounded-lg",
                            item.isVisible
                              ? "text-green-600 bg-green-50 hover:bg-green-100"
                              : "text-gray-400 bg-gray-50 hover:bg-gray-100",
                          )}
                          title={
                            item.isVisible ? "Ocultar Caso" : "Mostrar Caso"
                          }
                        >
                          {item.isVisible ? (
                            <Eye size={18} />
                          ) : (
                            <EyeOff size={18} />
                          )}
                        </button>
                        <button
                          onClick={() => openCaseModal(item)}
                          className="p-2 text-primary/70 hover:bg-secondary/20 hover:text-primary rounded-lg"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteCase(item.id)}
                          className="p-2 text-primary/70 hover:bg-red-50 hover:text-red-500 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONFIG TAB */}
          {activeTab === "CONFIG" && (
            <div className="max-w-4xl w-full min-w-0">
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-primary mb-8">
                Configuración General
              </h2>

              {successMsg && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                  <CheckCircle size={20} /> {successMsg}
                </div>
              )}

              <form
                onSubmit={handleSaveConfig}
                className="space-y-8 w-full min-w-0"
              >
                {/* Hero Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-primary/10">
                  <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                    <Layout size={20} /> Sección Principal (Hero)
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-primary/80 mb-1">
                        Etiqueta (Tagline)
                      </label>
                      <input
                        name="heroTagline"
                        defaultValue={siteConfig?.heroTagline}
                        placeholder="Ej: Atención Podológica Profesional"
                        className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-primary/80 mb-1">
                        Título Principal
                      </label>
                      <input
                        name="heroTitle"
                        defaultValue={siteConfig?.heroTitle}
                        className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-primary/80 mb-1">
                        Subtítulo
                      </label>
                      <textarea
                        name="heroSubtitle"
                        defaultValue={siteConfig?.heroSubtitle}
                        rows="2"
                        className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Avatar Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-primary/10">
                  <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                    <User size={20} /> Sección Avatar
                  </h3>
                  <div>
                    <ImageUpload
                      value={configAboutImage}
                      onChange={setConfigAboutImage}
                      label="Imagen de Perfil (Avatar)"
                    />
                  </div>
                </div>

                {/* About Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-primary/10">
                  <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                    <FileText size={20} /> Sección Mi Perfil
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-primary/80 mb-1">
                        Título
                      </label>
                      <input
                        name="aboutTitle"
                        defaultValue={siteConfig?.aboutTitle}
                        className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-primary/80 mb-1">
                        Descripción
                      </label>
                      <textarea
                        name="aboutText"
                        defaultValue={siteConfig?.aboutText}
                        rows="4"
                        className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                      />
                    </div>

                    {/* About Cards Sortable List */}
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-3">
                        <label className="block text-sm font-bold text-primary/80">
                          Tarjetas Perfil
                        </label>
                        <button
                          type="button"
                          onClick={() => openCardModal()}
                          className="text-xs bg-secondary/20 text-secondary-dark px-3 py-1.5 rounded-lg font-bold hover:bg-secondary/30 transition-colors flex items-center gap-1"
                        >
                          <Plus size={14} /> Agregar
                        </button>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl border border-primary/5 min-h-[100px]">
                        {aboutCards.length === 0 ? (
                          <div className="text-center text-primary/40 text-sm py-4">
                            No hay tarjetas. Agrega una nueva.
                          </div>
                        ) : (
                          <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                          >
                            <SortableContext
                              items={aboutCards}
                              strategy={verticalListSortingStrategy}
                            >
                              <div className="space-y-3">
                                {aboutCards.map((card) => (
                                  <SortableCard
                                    key={card.id}
                                    card={card}
                                    onEdit={openCardModal}
                                    onDelete={handleDeleteCard}
                                  />
                                ))}
                              </div>
                            </SortableContext>
                          </DndContext>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-primary/10">
                  <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                    <Mail size={20} /> Información de Contacto
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-primary/80 mb-1">
                        Teléfono
                      </label>
                      <div className="flex items-center gap-2">
                        <Phone size={18} className="text-primary/40" />
                        <input
                          name="phone"
                          defaultValue={siteConfig?.phone}
                          className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-primary/80 mb-1">
                        Instagram URL
                      </label>
                      <div className="flex items-center gap-2">
                        <Instagram size={18} className="text-primary/40" />
                        <input
                          name="instagram"
                          defaultValue={siteConfig?.instagram}
                          className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-opacity-90 transition-colors flex items-center gap-2 shadow-lg"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Guardar Cambios"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === "PROFILE" && (
            <div className="max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-primary mb-8">
                Mi Perfil
              </h2>

              {successMsg && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                  <CheckCircle size={20} /> {successMsg}
                </div>
              )}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                  <AlertCircle size={20} /> {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Change Password */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-primary/10">
                  <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                    <Key size={20} /> Cambiar Contraseña
                  </h3>
                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-primary/80 mb-1">
                        Contraseña Actual
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        required
                        className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-primary/80 mb-1">
                        Nueva Contraseña
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        required
                        className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-primary/80 mb-1">
                        Confirmar Contraseña
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        required
                        className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin mx-auto" />
                      ) : (
                        "Actualizar Contraseña"
                      )}
                    </button>
                  </form>
                </div>

                {/* Change Email */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-primary/10">
                  <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                    <Mail size={20} /> Cambiar Correo
                  </h3>
                  {emailStep === "REQUEST" ? (
                    <form
                      onSubmit={handleRequestEmailChange}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-bold text-primary/80 mb-1">
                          Nuevo Correo
                        </label>
                        <input
                          type="email"
                          value={pendingEmail}
                          onChange={(e) => setPendingEmail(e.target.value)}
                          required
                          placeholder="nuevo@correo.com"
                          className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading || !pendingEmail}
                        className="w-full py-2.5 bg-secondary text-primary font-bold rounded-lg hover:bg-opacity-90 transition-colors"
                      >
                        {loading ? (
                          <Loader2 className="animate-spin mx-auto" />
                        ) : (
                          "Solicitar Cambio"
                        )}
                      </button>
                    </form>
                  ) : (
                    <form
                      onSubmit={handleConfirmEmailChange}
                      className="space-y-4"
                    >
                      <p className="text-sm text-primary/70">
                        Hemos enviado un código a{" "}
                        <strong>{pendingEmail}</strong>. Ingrésalo para
                        confirmar.
                      </p>
                      <div>
                        <label className="block text-sm font-bold text-primary/80 mb-1">
                          Código (8 dígitos)
                        </label>
                        <input
                          name="code"
                          maxLength={8}
                          required
                          className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none font-mono text-center tracking-widest uppercase"
                          placeholder="XXXXXXXX"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEmailStep("REQUEST")}
                          className="flex-1 py-2.5 bg-gray-100 text-primary font-bold rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 py-2.5 bg-secondary text-primary font-bold rounded-lg hover:bg-opacity-90 transition-colors"
                        >
                          {loading ? (
                            <Loader2 className="animate-spin mx-auto" />
                          ) : (
                            "Confirmar"
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* SERVICE MODAL */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 z-50 overflow-y-hidden overscroll-contain">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 bg-primary text-white flex justify-between items-center">
              <h2 className="text-xl font-bold font-display">
                {currentService ? "Editar Servicio" : "Nuevo Servicio"}
              </h2>
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <form
              onSubmit={handleSubmitService}
              className="p-6 space-y-4 overflow-y-auto flex-1"
            >
              <div>
                <label className="block text-sm font-bold text-primary/80 mb-1">
                  Nombre
                </label>
                <input
                  name="name"
                  defaultValue={currentService?.name}
                  required
                  className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary/80 mb-1">
                  Descripción
                </label>
                <textarea
                  name="description"
                  defaultValue={currentService?.description}
                  rows="3"
                  className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-primary/80 mb-1">
                  Precio
                </label>
                <input
                  name="price"
                  type="number"
                  defaultValue={currentService?.price}
                  required
                  className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="showPrice"
                  id="showPrice"
                  defaultChecked={
                    currentService ? currentService.showPrice : true
                  }
                  className="w-4 h-4 text-secondary rounded border-gray-300 focus:ring-secondary"
                />
                <label
                  htmlFor="showPrice"
                  className="text-sm text-primary/70 cursor-pointer select-none"
                >
                  Mostrar precio públicamente
                </label>
              </div>
              <div>
                <label className="block text-sm font-bold text-primary/80 mb-1">
                  Categoría
                </label>
                <select
                  name="category"
                  defaultValue={currentService?.category || "Clínico"}
                  className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none bg-white"
                >
                  <option value="Clínico">Clínico</option>
                  <option value="Estético">Estético</option>
                  <option value="Ortopedia">Ortopedia</option>
                  <option value="Bienestar">Bienestar</option>
                </select>
              </div>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-5 py-2 text-primary/70 hover:bg-gray-100 rounded-lg font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-secondary text-primary font-bold rounded-lg hover:bg-opacity-90"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : currentService ? (
                    "Actualizar"
                  ) : (
                    "Guardar"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CASE MODAL */}
      {isCaseModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-hidden flex items-start sm:items-center justify-center p-4 overscroll-contain">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 bg-primary text-white flex justify-between items-center">
              <h2 className="text-xl font-bold font-display">
                {currentCase ? "Editar Caso" : "Nuevo Caso"}
              </h2>
              <button
                onClick={() => setIsCaseModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <form
              onSubmit={handleSubmitCase}
              className="p-6 overflow-y-auto flex-1"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-primary/80 mb-1">
                      Título
                    </label>
                    <input
                      name="title"
                      defaultValue={currentCase?.title}
                      required
                      className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-primary/80 mb-1">
                      Descripción
                    </label>
                    <div className="bg-white rounded-lg overflow-hidden">
                      <ReactQuill
                        theme="snow"
                        value={caseDescription}
                        onChange={setCaseDescription}
                        modules={{
                          toolbar: [
                            ["bold", "italic", "underline"],
                            [{ list: "ordered" }, { list: "bullet" }],
                            ["link"],
                          ],
                        }}
                        className="h-64 mb-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Images */}
                <div className="space-y-4">
                  <div>
                    <ImageUpload
                      value={caseImageBefore}
                      onChange={setCaseImageBefore}
                      label="Imagen Antes"
                    />
                  </div>
                  <div>
                    <ImageUpload
                      value={caseImageAfter}
                      onChange={setCaseImageAfter}
                      label="Imagen Después"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-between items-center border-t mt-6">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isVisible"
                    id="isVisibleCase"
                    defaultChecked={currentCase ? currentCase.isVisible : true}
                    className="hidden peer"
                  />
                  <label
                    htmlFor="isVisibleCase"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer select-none transition-colors peer-checked:bg-green-100 peer-checked:text-green-700 bg-gray-100 text-gray-500"
                  >
                    <Eye size={20} className="hidden peer-checked:block" />
                    <EyeOff size={20} className="block peer-checked:hidden" />
                  </label>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCaseModalOpen(false)}
                    className="p-2 text-primary/70 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="p-2 bg-secondary text-primary rounded-lg hover:bg-opacity-90"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Check size={20} />
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CARD MODAL */}
      {isCardModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-primary text-white flex justify-between items-center">
              <h2 className="text-xl font-bold font-display">
                {currentCard ? "Editar Tarjeta" : "Nueva Tarjeta"}
              </h2>
              <button
                onClick={() => setIsCardModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSaveCard} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-primary/80 mb-1">
                  Título
                </label>
                <input
                  name="title"
                  defaultValue={currentCard?.title}
                  required
                  placeholder="Ej: Formación"
                  className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary/80 mb-1">
                  Subtítulo (Opcional)
                </label>
                <input
                  name="subtitle"
                  defaultValue={currentCard?.subtitle}
                  placeholder="Ej: Universidad X"
                  className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary/80 mb-1">
                  Detalles/Año (Opcional)
                </label>
                <input
                  name="details"
                  defaultValue={currentCard?.details}
                  placeholder="Ej: 2020 - 2024"
                  className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCardModalOpen(false)}
                  className="px-5 py-2 text-primary/70 hover:bg-gray-100 rounded-lg font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-secondary text-primary font-bold rounded-lg hover:bg-opacity-90"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : currentCard ? (
                    "Actualizar"
                  ) : (
                    "Guardar"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
