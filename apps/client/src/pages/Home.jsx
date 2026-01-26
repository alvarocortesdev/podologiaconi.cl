// client/src/pages/Home.jsx
import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const cases = [
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1621317585250-8b1e06d396a9?auto=format&fit=crop&q=80&w=600"
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative bg-[#f4ede6] overflow-hidden">
        <div className="absolute -top-24 right-0 h-80 w-80 rounded-full bg-secondary/20 blur-3xl"></div>
        <div className="absolute -bottom-32 left-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 lg:flex lg:items-center lg:gap-14">
          {/* Text Content */}
          <div className="lg:w-1/2 text-center lg:text-left z-10">
            <h1 className="text-4xl lg:text-6xl font-display font-bold text-primary mb-6 leading-tight">
              Salud y belleza <br />
              <span className="text-secondary">para tus pies</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto lg:mx-0">
              Soy Coni, Podóloga Clínica Certificada. Brindo atención integral especializada en el diagnóstico y tratamiento de afecciones del pie, combinando técnicas clínicas con cuidado estético.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/servicios"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white bg-primary rounded-full hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Ver Servicios <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <a
                href="#sobre-mi"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-primary bg-white border-2 border-primary/10 rounded-full hover:border-secondary hover:text-secondary transition-all"
              >
                Conocer más
              </a>
            </div>
          </div>

          {/* Image/Blob */}
          <div className="lg:w-1/2 mt-12 lg:mt-0 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-secondary/10 rounded-full blur-3xl -z-10"></div>
            <div className="relative w-80 h-80 lg:w-[520px] lg:h-[520px] mx-auto rounded-[28%] overflow-hidden border-[10px] border-white shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1584515933487-9bdb0936e811?auto=format&fit=crop&q=80&w=800"
                alt="Podóloga atendiendo paciente"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Mí / Formación */}
      <section id="sobre-mi" className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-secondary font-bold uppercase tracking-wider text-sm">Perfil Profesional</span>
          <h2 className="text-3xl font-display font-bold text-primary mt-2">Formación Académica</h2>
        </div>
        
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-8 md:p-12 border border-secondary/10 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-bl-full -z-0"></div>
           
           <div className="grid md:grid-cols-2 gap-8 relative z-10">
             <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-secondary/20 rounded-lg text-primary">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-primary">Título Técnico Nivel Superior</h3>
                    <p className="text-gray-600 text-sm">Instituto Profesional AIEP</p>
                    <p className="text-gray-400 text-xs mt-1">2018 - 2020</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-secondary/20 rounded-lg text-primary">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-primary">Diplomado en Pie Diabético</h3>
                    <p className="text-gray-600 text-sm">Universidad de Chile</p>
                    <p className="text-gray-400 text-xs mt-1">2021</p>
                  </div>
                </div>
             </div>
             
             <div className="space-y-6">
               <div className="flex items-start gap-4">
                  <div className="p-3 bg-secondary/20 rounded-lg text-primary">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-primary">Certificación en Ortoplasia</h3>
                    <p className="text-gray-600 text-sm">Centro Clínico del Pie</p>
                    <p className="text-gray-400 text-xs mt-1">2022</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-secondary/20 rounded-lg text-primary">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-primary">Registro SIS</h3>
                    <p className="text-gray-600 text-sm">Superintendencia de Salud</p>
                    <p className="text-gray-400 text-xs mt-1">N° Registro: 458921</p>
                  </div>
                </div>
             </div>
           </div>
        </div>
      </section>

      {/* Portafolio Slider (Simple CSS Scroll Snap) */}
      <section className="bg-primary/5 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-primary">Casos Clínicos</h2>
            <p className="text-slate-600 mt-2">Resultados reales de mis tratamientos</p>
          </div>

          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-10 px-4 scrollbar-hide">
            {cases.map((img, idx) => (
              <div 
                key={idx} 
                className="snap-center shrink-0 w-[280px] md:w-[420px] h-[280px] md:h-[420px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <img 
                  src={img} 
                  alt={`Caso Clínico ${idx + 1}`} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-4 italic">Desliza para ver más casos →</p>
        </div>
      </section>
    </div>
  );
}
