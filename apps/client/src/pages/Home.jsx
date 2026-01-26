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
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative bg-[#f4ede6] overflow-hidden">
        <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-secondary/20 blur-3xl"></div>
        <div className="absolute -bottom-40 left-0 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-28 lg:flex lg:items-center lg:gap-14">
          {/* Text Content */}
          <div className="lg:w-1/2 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-primary shadow-sm">
              Atención clínica especializada
            </div>
            <h1 className="text-4xl lg:text-6xl font-display font-bold text-primary mt-6 mb-6 leading-tight">
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
            <div className="mt-10 grid grid-cols-3 gap-4 text-left">
              <div className="rounded-2xl bg-white/70 p-4 shadow-sm">
                <p className="text-2xl font-display font-semibold text-primary">+6</p>
                <p className="text-xs uppercase tracking-widest text-slate-500">Años</p>
              </div>
              <div className="rounded-2xl bg-white/70 p-4 shadow-sm">
                <p className="text-2xl font-display font-semibold text-primary">100%</p>
                <p className="text-xs uppercase tracking-widest text-slate-500">Higiene</p>
              </div>
              <div className="rounded-2xl bg-white/70 p-4 shadow-sm">
                <p className="text-2xl font-display font-semibold text-primary">+500</p>
                <p className="text-xs uppercase tracking-widest text-slate-500">Pacientes</p>
              </div>
            </div>
          </div>

          {/* Image/Blob */}
          <div className="lg:w-1/2 mt-14 lg:mt-0 relative">
            <div className="absolute -top-8 -right-8 h-24 w-24 rounded-2xl bg-secondary/40 shadow-lg"></div>
            <div className="absolute -bottom-6 left-12 h-16 w-16 rounded-full bg-primary/20"></div>
            <div className="relative w-80 h-80 lg:w-[520px] lg:h-[520px] mx-auto rounded-[28%] overflow-hidden border-[10px] border-white shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1584515933487-9bdb0936e811?auto=format&fit=crop&q=80&w=800"
                alt="Podóloga atendiendo paciente"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-10 right-6 rounded-2xl bg-white px-6 py-4 shadow-xl">
              <p className="text-xs uppercase tracking-widest text-slate-500">Certificada</p>
              <p className="text-lg font-semibold text-primary">Podología Clínica</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Mí / Formación */}
      <section id="sobre-mi" className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-secondary font-bold uppercase tracking-wider text-sm">Perfil Profesional</span>
          <h2 className="text-3xl font-display font-bold text-primary mt-2">Formación Académica</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: "Título Técnico Nivel Superior",
              org: "Instituto Profesional AIEP",
              year: "2018 - 2020",
            },
            {
              title: "Diplomado en Pie Diabético",
              org: "Universidad de Chile",
              year: "2021",
            },
            {
              title: "Certificación en Ortoplasia",
              org: "Centro Clínico del Pie",
              year: "2022",
            },
            {
              title: "Registro SIS",
              org: "Superintendencia de Salud",
              year: "N° Registro: 458921",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-secondary/20 bg-white/90 p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-secondary/20 text-primary">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.org}</p>
                  <p className="text-xs text-slate-500 mt-2">{item.year}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Portafolio Slider (Simple CSS Scroll Snap) */}
      <section className="bg-primary/5 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-primary">Casos Clínicos</h2>
            <p className="text-slate-600 mt-2">Resultados reales de mis tratamientos</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {cases.map((img, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-3xl shadow-lg"
              >
                <img
                  src={img}
                  alt={`Caso Clínico ${idx + 1}`}
                  className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
                <span className="absolute bottom-4 left-4 rounded-full bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                  Caso {idx + 1}
                </span>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-500 mt-6 italic">Más casos disponibles en consulta</p>
        </div>
      </section>
    </div>
  );
}
