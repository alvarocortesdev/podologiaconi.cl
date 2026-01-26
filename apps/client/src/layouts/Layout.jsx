// client/src/layouts/Layout.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Mail } from 'lucide-react';
import clsx from 'clsx';

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Servicios', path: '/servicios' },
    { name: 'Contacto', path: '/#contacto' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-primary">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-secondary/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold tracking-tighter text-primary">
              Podología<span className="text-secondary">Coni</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={clsx(
                    "text-lg font-medium transition-colors duration-200 hover:text-secondary",
                    location.pathname === link.path ? "text-secondary font-bold" : "text-primary"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/admin"
                className="px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-md"
              >
                Admin
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-primary hover:text-secondary focus:outline-none"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-secondary/20">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-background hover:text-secondary"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white py-10 mt-auto">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold mb-4">PodologíaConi</h3>
            <p className="text-gray-300 text-sm">
              Cuidado profesional para la salud de tus pies.
              Tratamientos personalizados con enfoque clínico y estético.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contacto</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-center justify-center md:justify-start gap-2">
                <Mail size={16} /> contacto@podologiaconi.cl
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <Instagram size={16} /> @podologia_coni
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Ubicación</h3>
            <p className="text-gray-300 text-sm">
              Atención a domicilio y consulta privada.
              <br />Región Metropolitana, Chile.
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Podología Coni. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
