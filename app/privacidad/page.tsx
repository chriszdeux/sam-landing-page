import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Privacidad | Lyncore',
  description: 'Información sobre el tratamiento de datos y protección de la privacidad en Lyncore.',
};

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 px-4 sm:px-6 lg:px-8 py-20 relative">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="border-b border-slate-800 pb-6">
          <Link href="/" className="text-xs font-mono text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 mb-4">
            ← Volver al inicio
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Política de Privacidad y Protección de Datos
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Última actualización: 14 de octubre de 2026
          </p>
        </header>

        <section className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl font-bold text-white">1. Responsable del Tratamiento</h2>
          <p>
            Lyncore se compromete a salvaguardar la privacidad de sus usuarios de conformidad con los principios de licitud, lealtad y transparencia establecidos por las directrices del Reglamento General de Protección de Datos (RGPD) y leyes aplicables de protección de datos personales.
          </p>
        </section>

        <section className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl font-bold text-white">2. Datos Recabados y Finalidad</h2>
          <p>
            Recabamos únicamente la información necesaria para prestar el servicio:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-400 pl-2">
            <li><strong>Datos de autenticación y cuenta:</strong> Dirección de correo electrónico y credenciales seguras para acceso al panel.</li>
            <li><strong>Datos de navegación y telemetría anónima:</strong> Dirección IP anonimizada, tipo de navegador y eventos de uso interno para optimizar el rendimiento de la aplicación.</li>
            <li><strong>Comunicaciones:</strong> Mensajes enviados a través de formularios de soporte o consultas comerciales.</li>
          </ul>
        </section>

        <section className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl font-bold text-white">3. Base Jurídica y Conservación</h2>
          <p>
            El tratamiento se basa en la ejecución del contrato de servicio o el consentimiento explícito del usuario. Los datos se conservarán durante el tiempo estrictamente necesario para cumplir con las finalidades declaradas y las obligaciones legales.
          </p>
        </section>

        <section className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl font-bold text-white">4. Derechos del Usuario (ARCO / RGPD)</h2>
          <p>
            Usted tiene derecho a acceder, rectificar, suprimir, limitar u oponerse al tratamiento de sus datos personales, así como a solicitar su portabilidad. Para ejercer estos derechos, puede comunicarse a través del canal oficial de soporte de la plataforma.
          </p>
        </section>

        <section className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl font-bold text-white">5. Seguridad de la Información</h2>
          <p>
            Implementamos cifrado en tránsito mediante protocolos HTTPS/TLS 1.3, hashing criptográfico de contraseñas y aislamiento de infraestructura para prevenir accesos no autorizados.
          </p>
        </section>
      </div>
    </main>
  );
}
