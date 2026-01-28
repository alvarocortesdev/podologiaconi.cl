// client/src/pages/Home.jsx
import React from 'react';
import { ArrowRight, CheckCircle, Leaf, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const cases = [
    "https://images.unsplash.com/photo-1600885144640-3cfc60c88a8d?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1576091160550-2173dba9996a?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1618939307823-f24e93c1a329?auto=format&fit=crop&q=80&w=800"
  ];

  return (
    <div className="pb-16 sm:pb-24">
      {/* Hero Section */}
      <section className="relative bg-background pt-12 pb-16 sm:pt-20 sm:pb-24 lg:pt-32 lg:pb-36 overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 sm:h-64 sm:w-64 lg:h-96 lg:w-96 rounded-full bg-secondary/20 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 h-48 w-48 sm:h-64 sm:w-64 lg:h-[28rem] lg:w-[28rem] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 lg:items-center lg:gap-20">
            {/* Text Content */}
            <div className="text-center lg:text-left z-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-primary">
                Atención Podológica Profesional
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-display font-bold text-primary mt-4 sm:mt-5 mb-4 sm:mb-6 leading-tight">
                Bienestar y Salud <br />
                <span className="text-secondary">para tus Pies</span>
              </h1>
              <p className="text-base sm:text-lg text-primary/70 mb-6 sm:mb-10 max-w-xl mx-auto lg:mx-0 px-2 sm:px-0">
                Soy Coni, Podóloga Clínica certificada dedicada a brindar una atención integral y personalizada. Mi objetivo es diagnosticar y tratar las afecciones de tus pies, combinando las mejores técnicas clínicas con un cuidado estético superior.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-2 sm:px-0">
                <Link
                  to="/servicios"
                  className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-3.5 text-sm sm:text-base font-bold text-primary bg-secondary rounded-full hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Ver Servicios <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                <a
                  href="#sobre-mi"
                  className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-3.5 text-sm sm:text-base font-bold text-primary bg-white border border-primary/10 rounded-full hover:border-secondary transition-all"
                >
                  Sobre Mí
                </a>
              </div>
            </div>

            {/* Image */}
            <div className="relative mt-12 sm:mt-16 lg:mt-0 flex justify-center">
              <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-[480px] lg:h-[480px] bg-primary/10 rounded-full p-3 sm:p-4">
                <div className="w-full h-full rounded-full overflow-hidden shadow-2xl border-4 sm:border-8 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1584515933487-9bdb0936e811?auto=format&fit=crop&q=80&w=800"
                    alt="Podóloga Coni - Especialista en cuidado podológico integral"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="absolute -bottom-6 sm:-bottom-8 left-2 sm:left-0 lg:-left-8 rounded-xl sm:rounded-2xl bg-white px-4 py-3 sm:px-6 sm:py-4 shadow-xl animate-float">
                <p className="font-bold text-primary text-base sm:text-lg">Coni</p>
                <p className="text-xs sm:text-sm text-primary/60">Podóloga Clínica</p>
              </div>
              <div className="absolute top-2 sm:top-0 right-2 sm:right-0 lg:-right-8 rounded-full bg-secondary p-2 sm:p-3 shadow-xl text-primary animate-float animation-delay-500">
                <Stethoscope size={24} className="sm:w-7 sm:h-7"/>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: <Stethoscope size={28} className="text-primary"/>, title: "Diagnóstico Clínico", desc: "Evaluación completa para detectar y tratar patologías." },
              { icon: <Leaf size={28} className="text-primary"/>, title: "Cuidado Integral", desc: "Tratamientos que combinan salud y estética para tus pies." },
              { icon: <CheckCircle size={28} className="text-primary"/>, title: "Profesional Certificada", desc: "Atención segura y calificada con registro SIS." }
            ].map(feature => (
              <div key={feature.title} className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-sm border border-primary/5 text-center transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="inline-block bg-secondary/20 p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-primary mb-2">{feature.title}</h3>
                <p className="text-sm sm:text-base text-primary/70">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Sobre Mí / Formación */}
      <section id="sobre-mi" className="pb-16 sm:pb-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <span className="font-bold uppercase tracking-wider text-xs sm:text-sm text-secondary">Mi Perfil</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-primary mt-2">Formación y Trayectoria</h2>
          </div>
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Técnico Nivel Superior", org: "Instituto AIEP", year: "2018-2020" },
              { title: "Diplomado Pie Diabético", org: "Universidad de Chile", year: "2021" },
              { title: "Cert. en Ortoplasia", org: "Centro Clínico del Pie", year: "2022" },
              { title: "Registro SIS N°458921", org: "Superintendencia de Salud", year: "Vigente" },
            ].map((item) => (
              <div key={item.title} className="bg-primary/5 border-l-4 border-secondary p-5 sm:p-6 rounded-r-lg">
                <h3 className="text-base sm:text-lg font-bold text-primary">{item.title}</h3>
                <p className="text-sm sm:text-md text-primary/80 font-medium">{item.org}</p>
                <p className="text-xs sm:text-sm text-primary/60 mt-2">{item.year}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portafolio */}
      <section className="bg-white py-16 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-primary">Casos de Éxito</h2>
            <p className="text-sm sm:text-base text-primary/70 mt-2 sm:mt-3 max-w-2xl mx-auto px-2 sm:px-0">Resultados que reflejan la dedicación y profesionalismo en cada tratamiento.</p>
          </div>

          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {cases.map((img, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg"
              >
                <img
                  src={img}
                  alt={`Caso Clínico ${idx + 1} - Tratamiento podológico profesional`}
                  className="h-64 sm:h-80 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4 sm:p-6">
                  <h3 className="text-white text-lg sm:text-xl font-bold">Tratamiento {idx + 1}</h3>
                  <p className="text-secondary font-semibold text-sm sm:text-base">Ver más</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs sm:text-sm text-primary/60 mt-6 sm:mt-8 italic px-2">Las imágenes son referenciales y los resultados pueden variar.</p>
        </div>
      </section>
    </div>
  );
}
