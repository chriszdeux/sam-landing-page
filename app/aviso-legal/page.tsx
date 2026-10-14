import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Aviso Legal | Lyncore',
  description: 'Términos, condiciones de uso y aviso legal de la plataforma Lyncore.',
};

export default function AvisoLegalPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 px-4 sm:px-6 lg:px-8 py-20 relative">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="border-b border-slate-800 pb-6">
          <Link href="/" className="text-xs font-mono text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 mb-4">
            ← Volver al inicio
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Aviso Legal y Condiciones de Uso
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Última actualización: 14 de octubre de 2026
          </p>
        </header>

        <section className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl font-bold text-white">1. Datos Identificativos</h2>
          <p>
            En cumplimiento del deber de información, la plataforma <strong>Lyncore</strong> (en adelante, &ldquo;la Plataforma&rdquo;) es un entorno digital de simulación financiera, análisis de datos blockchain y exploración interactiva gestionado bajo los estándares de transparencia y seguridad técnica vigentes.
          </p>
        </section>

        <section className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl font-bold text-white">2. Naturaleza del Servicio</h2>
          <p>
            Lyncore ofrece simulaciones educativas, modelado algorítmico y visualización de mercados criptográficos y activos digitales. Salvo indicación expresa en contrario, los servicios prestados tienen finalidad exclusivamente formativa, analítica y de entretenimiento tecnológico, no constituyendo asesoramiento financiero directo ni recomendación de inversión.
          </p>
        </section>

        <section className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl font-bold text-white">3. Propiedad Intelectual e Industrial</h2>
          <p>
            Todos los contenidos de la plataforma (código fuente, diseños, logotipos, marcas, algoritmos, modelos 3D y textos) son titularidad de Lyncore o de terceros licenciantes. Queda prohibida la reproducción, distribución o transformación no autorizada expresamente por escrito.
          </p>
        </section>

        <section className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl font-bold text-white">4. Exclusión de Garantías y Responsabilidad</h2>
          <p>
            Lyncore implementa medidas continuas de seguridad y alta disponibilidad. No obstante, no garantiza la ausencia total de interrupciones o errores técnicos derivados de causas de fuerza mayor o proveedores de infraestructura de red.
          </p>
        </section>

        <section className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl font-bold text-white">5. Ley Aplicable y Jurisdicción</h2>
          <p>
            Para la resolución de controversias relativas al presente aviso legal o a la utilización del portal, será de aplicación la normativa vigente y los tribunales competentes correspondientes.
          </p>
        </section>
      </div>
    </main>
  );
}
