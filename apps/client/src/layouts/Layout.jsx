// client/src/layouts/Layout.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Mail, Phone, Globe, Linkedin, Whatsapp } from 'lucide-react';
import clsx from 'clsx';

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Servicios', path: '/servicios' },
    { name: 'Contacto', path: '#contacto' }, // Updated to be an anchor link
  ];

  const handleScrollTo = (e, id) => {
    if (location.pathname !== '/') {
      // If not on home page, navigate and then scroll
      window.location.href = '/' + id;
    } else {
      e.preventDefault();
      const element = document.querySelector(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-primary">
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-lg sticky top-0 z-50 border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-3xl font-display font-bold tracking-tight text-primary">
                Podología<span className="text-secondary">Coni</span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex md:items-center md:space-x-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={(e) => link.path.startsWith('#') && handleScrollTo(e, link.path)}
                  className={clsx(
                    "text-base font-medium transition-colors duration-300 relative group",
                    location.pathname === link.path ? "text-secondary font-semibold" : "text-primary/70 hover:text-primary"
                  )}
                >
                  {link.name}
                  <span className="absolute bottom-[-2px] left-0 w-full h-0.5 bg-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                </Link>
              ))}
            </div>

            {/* CTA Button */}
{/*             <div className="hidden md:flex items-center">
              <Link
                to="/admin"
                className="inline-flex items-center px-6 py-2.5 text-sm font-bold text-primary bg-secondary rounded-full hover:bg-opacity-90 transition-all shadow-sm"
              >
                Área Clientes
              </Link>
            </div> */}

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
        <div
          className={clsx(
            'md:hidden bg-white overflow-hidden transition-all duration-300 ease-in-out',
            isOpen ? 'max-h-96 opacity-100 border-t border-primary/10' : 'max-h-0 opacity-0'
          )}
        >
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={(e) => {
                  if (link.path.startsWith('#')) handleScrollTo(e, link.path);
                  setIsOpen(false);
                }}
                className="block px-3 py-3 rounded-md text-base font-medium text-primary hover:bg-background hover:text-secondary"
              >
                {link.name}
              </Link>
            ))}
{/*             <Link
              to="/admin"
              className="block w-full text-left mt-2 px-3 py-3 rounded-md text-base font-medium text-primary bg-secondary/20 hover:bg-secondary/30"
            >
              Área Clientes
            </Link> */}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-grow w-full">
        {children}
      </main>

      {/* Footer */}
      <footer id="contacto" className="bg-primary text-white pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            
            {/* About */}
            <div className="md:col-span-5 lg:col-span-6">
              <h3 className="text-2xl font-display font-bold mb-4">
                Podología<span className="text-secondary">Coni</span>
              </h3>
              <p className="text-gray-300 text-sm max-w-md">
                Cuidado profesional para la salud y belleza de tus pies.
                Ofrezco tratamientos personalizados con un enfoque clínico y estético para garantizar tu bienestar.
              </p>
            </div>

            {/* Links */}
            <div className="md:col-span-3 lg:col-span-2">
              <h3 className="text-lg font-bold tracking-wider uppercase mb-4 text-secondary">Menú</h3>
              <ul className="space-y-3">
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Inicio</Link></li>
                <li><Link to="/servicios" className="text-gray-300 hover:text-white transition-colors">Servicios</Link></li>
                <li><a href="#contacto" onClick={(e) => handleScrollTo(e, '#contacto')} className="text-gray-300 hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
            
            {/* Contact */}
            <div className="md:col-span-4 lg:col-span-4">
              <h3 className="text-lg font-bold tracking-wider uppercase mb-4 text-secondary">Contacto</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex items-center gap-3">
                  <Whatsapp size={18} /> <a href="https://wa.me/56989611241" target="_blank" rel="noopener noreferrer"><span>Whatsapp</span></a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} /> <span>+56 9 8961 1241</span>
                </li>
                <li className="flex items-center gap-3">
                  <Instagram size={18} /> 
                  <a
                  href="https://www.instagram.com/podologia.coni/"
                  target="_blank"
                  rel="noopener noreferrer">
                    <span>@podologia.coni</span>
                    </a>
                </li>
              </ul>
            </div>

          </div>
          <div className="mt-12 pt-6 border-t border-white/20 text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Podología Coni. Todos los derechos reservados.</p>

            {/* Divider */}
            <div className="mx-auto my-4 h-px w-24 bg-white/20" />

            {/* Developer credits */}
            <div className="flex flex-col items-center gap-3">
              <p>Sitio desarrollado por Alvaro Pelusa™ Cortés</p>

              <div className="flex gap-6">
                <a
                  href="https://www.alvarocortes.cl"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Sitio web"
                  className="hover:text-white transition-colors"
                >
                  <Globe size={18} />
                </a>

                <a
                  href="https://www.linkedin.com/in/alvarocortesopazo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="hover:text-white transition-colors"
                >
                  <Linkedin size={18} />
                </a>

                <a
                  href="mailto:alvaro.cortes.dev@outlook.com"
                  aria-label="Correo"
                  className="hover:text-white transition-colors"
                >
                  <Mail size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
