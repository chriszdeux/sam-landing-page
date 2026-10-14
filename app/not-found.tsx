import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-16 text-center relative overflow-hidden bg-slate-950 text-slate-100">
      {/* Background ambient glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none -top-24 -left-24" />
      <div className="absolute w-[450px] h-[450px] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none -bottom-24 -right-24" />

      <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center">
        <span className="px-3 py-1 rounded-full text-xs font-mono tracking-widest uppercase bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 mb-6">
          Error 404 • Coordenadas Desconocidas
        </span>

        <h1 className="text-7xl sm:text-9xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 mb-4 font-mono">
          404
        </h1>

        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
          Sector del universo no encontrado
        </h2>

        <p className="text-slate-400 text-sm sm:text-base mb-8 leading-relaxed max-w-md">
          La ruta interestelar que intentas explorar no existe o ha sido reubicada por el Consejo Galáctico.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-medium text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 transition-all duration-200 shadow-lg shadow-cyan-500/20 active:scale-[0.98]"
          >
            ← Volver a la Estación Base (Inicio)
          </Link>
          <Link
            href="/operaciones"
            className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-medium text-sm text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all duration-200"
          >
            Ver Operaciones
          </Link>
        </div>
      </div>
    </main>
  );
}
