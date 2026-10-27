import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Repeat,
  CheckCircle2,
  TrendingUp,
  FileCheck,
  Sun,
  Moon,
  Menu,
  X,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const LandingPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Single high-end architectural building image
  const buildingImage = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=80';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-deep)', color: 'var(--text-secondary)', position: 'relative' }}>
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(100%, 1000px)',
          height: '420px',
          background: theme === 'dark'
            ? 'radial-gradient(ellipse at top, rgba(255, 255, 255, 0.05) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at top, rgba(2, 132, 199, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Top Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'var(--nav-bg)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--surface-glass-border)',
          transition: 'background-color 200ms ease, border-color 200ms ease',
        }}
      >
        <div
          className="container-responsive"
          style={{
            height: 'var(--topbar-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Brand - Pure, confident typography without icon */}
          <Link to="/" style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '22px',
                letterSpacing: '0.05em',
                color: 'var(--text-primary)',
                lineHeight: 1,
              }}
            >
              KREA NOVA
            </span>
            <span
              style={{
                fontSize: '9px',
                color: 'var(--text-subtle)',
                letterSpacing: '0.14em',
                fontWeight: 700,
                marginTop: '3px',
              }}
            >
              REAL ESTATE INVESTMENTS
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            style={{ display: 'flex', gap: '28px', alignItems: 'center' }}
            className="desktop-nav"
          >
            <a href="#como-funciona" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', fontWeight: 500, transition: 'color 150ms' }}>
              Cómo Funciona
            </a>
            <a href="#seguridad" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', fontWeight: 500, transition: 'color 150ms' }}>
              Seguridad Jurídica
            </a>
            <a href="#comparativa" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', fontWeight: 500, transition: 'color 150ms' }}>
              Comparativa
            </a>
            <Link to="/app/projects" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', fontWeight: 500, transition: 'color 150ms' }}>
              Oportunidades
            </Link>
          </nav>

          {/* Action CTAs + Theme Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'var(--btn-secondary-bg)',
                border: '1px solid var(--btn-secondary-border)',
                color: 'var(--text-primary)',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
              title={theme === 'dark' ? 'Cambiar a modo Blanco' : 'Cambiar a modo Negro'}
              aria-label="Alternar tema visual"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <Link to="/auth?mode=login" className="btn-secondary desktop-cta" style={{ padding: '8px 18px', fontSize: 'var(--text-sm)' }}>
              Ingresar
            </Link>
            <Link to="/auth?mode=register" className="btn-primary" style={{ padding: '8px 18px', fontSize: 'var(--text-sm)' }}>
              Crear Cuenta
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-btn"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'var(--btn-secondary-bg)',
                border: '1px solid var(--btn-secondary-border)',
                color: 'var(--text-primary)',
                display: 'none',
                placeItems: 'center',
              }}
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            style={{
              padding: '16px 24px 24px',
              borderTop: '1px solid var(--surface-glass-border)',
              background: 'var(--nav-bg)',
              display: 'grid',
              gap: '16px',
            }}
          >
            <a
              href="#como-funciona"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: 'var(--text-base)', color: 'var(--text-primary)', fontWeight: 500 }}
            >
              Cómo Funciona
            </a>
            <a
              href="#seguridad"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: 'var(--text-base)', color: 'var(--text-primary)', fontWeight: 500 }}
            >
              Seguridad Jurídica
            </a>
            <a
              href="#comparativa"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: 'var(--text-base)', color: 'var(--text-primary)', fontWeight: 500 }}
            >
              Comparativa
            </a>
            <Link
              to="/app/projects"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: 'var(--text-base)', color: 'var(--text-primary)', fontWeight: 500 }}
            >
              Oportunidades
            </Link>
            <div style={{ paddingTop: '12px', borderTop: '1px solid var(--surface-glass-border)', display: 'grid', gap: '10px' }}>
              <Link to="/auth?mode=login" className="btn-secondary" style={{ textAlign: 'center' }}>
                Iniciar Sesión
              </Link>
              <Link to="/auth?mode=register" className="btn-primary" style={{ textAlign: 'center' }}>
                Crear Cuenta
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION - PERSUASIVE, VALUE-DRIVEN COPYWRITING */}
      <section className="container-responsive" style={{ paddingTop: 'clamp(40px, 6vw, 72px)', paddingBottom: '48px', position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', maxWidth: '860px', margin: '0 auto 44px' }}>
          <h1
            style={{
              fontSize: 'clamp(2.25rem, 5.2vw, 3.75rem)',
              lineHeight: 1.08,
              letterSpacing: '-0.035em',
              marginBottom: '20px',
              color: 'var(--text-primary)',
            }}
          >
            Sé dueño de los mejores edificios de la ciudad. Desde $500 USD y cobrando rentas en dólares.
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.1875rem)',
              lineHeight: 1.65,
              color: 'var(--text-muted)',
              maxWidth: '700px',
              margin: '0 auto 32px',
            }}
          >
            Tu patrimonio blindado por metros cuadrados reales, no por promesas. Participá de desarrollos
            inmobiliarios de alta gama, recibí dividendos trimestrales en tu cuenta y vendé cuando quieras
            con total liquidez.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/app" className="btn-primary" style={{ height: '48px', padding: '0 30px', fontSize: 'var(--text-base)' }}>
              <span>Empezar a Invertir</span>
              <ArrowRight size={18} />
            </Link>
            <a href="#como-funciona" className="btn-secondary" style={{ height: '48px', padding: '0 30px', fontSize: 'var(--text-base)' }}>
              <span>Cómo Funciona</span>
            </a>
          </div>
        </div>

        {/* HERO BANNER - SAME IMAGE, ADAPTS TO CLEAR VIBRANT COLORS IN LIGHT MODE */}
        <div
          style={{
            position: 'relative',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            border: '1px solid var(--surface-glass-border)',
            boxShadow: 'var(--shadow-elevation)',
            background: 'var(--surface-card)',
          }}
        >
          {/* Single Building: Crisp, clear natural colors under blue sky in Light Mode / Moody in Dark Mode */}
          <div
            style={{
              width: '100%',
              height: 'clamp(320px, 42vw, 540px)',
              backgroundImage: `url("${buildingImage}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 40%',
              filter: 'var(--banner-filter)',
              transition: 'filter 250ms ease',
            }}
          />

          {/* Vignette Gradients */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'var(--banner-overlay)',
              pointerEvents: 'none',
              transition: 'background 250ms ease',
            }}
          />

          {/* Floating Glass Stats Over the Building */}
          <div
            style={{
              position: 'absolute',
              bottom: 'clamp(16px, 3vw, 32px)',
              left: 'clamp(16px, 3vw, 32px)',
              right: 'clamp(16px, 3vw, 32px)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
            }}
          >
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginBottom: '6px', fontWeight: 600 }}>
                <TrendingUp size={16} />
                <span>Renta en Dólares</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-primary)' }}>
                12.8% APY <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)' }}>en USD</span>
              </div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-subtle)' }}>Cobro trimestral en tu cuenta</span>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginBottom: '6px', fontWeight: 600 }}>
                <FileCheck size={16} />
                <span>Garantía Real</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)' }}>
                Fideicomiso Inscripto
              </div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-subtle)' }}>Tu inversión protegida por escritura</span>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginBottom: '6px', fontWeight: 600 }}>
                <Repeat size={16} />
                <span>Liquidez Inmediata</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)' }}>
                Mercado Secundario
              </div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-subtle)' }}>Vendé tus participaciones cuando quieras</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: CÓMO FUNCIONA - JUST THE ESSENTIAL VALUE, ZERO CLUTTER */}
      <section
        id="como-funciona"
        className="container-responsive"
        style={{
          paddingTop: 'clamp(56px, 8vw, 88px)',
          paddingBottom: 'clamp(56px, 8vw, 88px)',
          borderTop: '1px solid var(--surface-glass-border)',
          scrollMarginTop: 'clamp(80px, 12vh, 140px)',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 56px' }}>
          <span className="badge-pill" style={{ marginBottom: '16px' }}>
            Paso a Paso
          </span>
          <h2 style={{ fontSize: 'clamp(1.875rem, 4vw, 2.625rem)', marginBottom: '16px' }}>
            Invertir en inmuebles ahora es simple
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-md)', lineHeight: 1.6 }}>
            Eliminamos las barreras de entrada, los intermediarios y la burocracia para que tu capital trabaje desde el primer día.
          </p>
        </div>

        {/* 3 Clean Cards - Only essential, persuasive content */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {/* Card 1 */}
          <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'var(--btn-secondary-bg)',
                border: '1px solid var(--btn-secondary-border)',
                display: 'grid',
                placeItems: 'center',
                marginBottom: '20px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 'var(--text-md)',
              }}
            >
              01
            </div>

            <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: '12px', fontWeight: 700 }}>
              Elegís el proyecto que más te rinde
            </h3>

            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-base)', lineHeight: 1.65 }}>
              Explorás obras residenciales y corporativas en ubicaciones estratégicas. Conocés la rentabilidad proyectada,
              los planos, la empresa constructora y el avance real antes de invertir.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'var(--btn-primary-bg)',
                color: 'var(--btn-primary-text)',
                display: 'grid',
                placeItems: 'center',
                marginBottom: '20px',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 'var(--text-md)',
              }}
            >
              02
            </div>

            <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: '12px', fontWeight: 700 }}>
              Invertís tu monto exacto en minutos
            </h3>

            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-base)', lineHeight: 1.65 }}>
              Olvidate de necesitar $100.000 USD para comprar un departamento entero. Entrás desde $500 USD
              y recibís tus participaciones digitales respaldadas jurídicamente en el fideicomiso de la obra.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'var(--btn-secondary-bg)',
                border: '1px solid var(--btn-secondary-border)',
                display: 'grid',
                placeItems: 'center',
                marginBottom: '20px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 'var(--text-md)',
              }}
            >
              03
            </div>

            <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: '12px', fontWeight: 700 }}>
              Cobrás rentas y salís cuando querés
            </h3>

            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-base)', lineHeight: 1.65 }}>
              Cobrás dividendos periódicos por alquiler o plusvalía de venta en tu cuenta. Y si necesitás liquidez antes
              de que finalice la construcción, podés vender tus participaciones en el mercado secundario.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION: RESPALDO Y CERTEZA (SELLING SAFETY) */}
      <section
        id="seguridad"
        className="container-responsive"
        style={{
          paddingBottom: 'clamp(56px, 8vw, 88px)',
          scrollMarginTop: 'clamp(90px, 14vh, 180px)',
        }}
      >
        <div
          className="glass-panel"
          style={{
            padding: 'clamp(28px, 5vw, 48px)',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', alignItems: 'center' }}>
            <div>
              <span className="badge-pill" style={{ marginBottom: '16px' }}>
                <ShieldCheck size={14} />
                Seguridad Jurídica
              </span>
              <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', marginBottom: '16px' }}>
                Tu capital respaldado por la ley, no por promesas
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-base)', lineHeight: 1.65, marginBottom: '24px' }}>
                No emitimos monedas volátiles ni especulaciones digitales. Cada participación que adquirís
                es un derecho económico certificado sobre un inmueble tangible.
              </p>

              <div style={{ display: 'grid', gap: '14px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--text-primary)', marginTop: '2px', flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    <strong>Fideicomiso independiente:</strong> El patrimonio de la obra está blindado legalmente de cualquier contingencia ajena.
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--text-primary)', marginTop: '2px', flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    <strong>Avance de obra auditado:</strong> Los fondos se transfieren por etapas certificadas por peritos independientes.
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--text-primary)', marginTop: '2px', flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    <strong>Trazabilidad y control:</strong> Podés verificar tus saldos, contratos y liquidaciones en tiempo real desde tu perfil.
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Confidence Pillar */}
            <div
              style={{
                background: 'var(--surface-card)',
                border: '1px solid var(--surface-glass-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '28px',
                display: 'grid',
                gap: '16px',
              }}
            >
              <div style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-subtle)', fontWeight: 600 }}>
                El Estándar Krea Nova
              </div>

              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ padding: '16px', background: 'var(--surface-card-hover)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--text-primary)' }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginBottom: '2px' }}>
                    1. Respaldo Inmobiliario Físico
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                    Terrenos con títulos perfectos, planos aprobados y obras en marcha.
                  </div>
                </div>

                <div style={{ padding: '16px', background: 'var(--surface-card-hover)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--text-muted)' }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginBottom: '2px' }}>
                    2. Contrato Legal Directo
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                    Certificado de cesión de derechos económicos fiduciarios.
                  </div>
                </div>

                <div style={{ padding: '16px', background: 'var(--surface-card-hover)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--text-subtle)' }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginBottom: '2px' }}>
                    3. Liquidez en Mercado Secundario
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                    Libertad total de desinversión entre inversores de la comunidad.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: COMPARATIVA TRADICIONAL VS KREA NOVA */}
      <section
        id="comparativa"
        className="container-responsive"
        style={{
          paddingBottom: 'clamp(64px, 10vw, 100px)',
          scrollMarginTop: 'clamp(80px, 12vh, 140px)',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', marginBottom: '12px' }}>
            El nuevo estándar de inversión
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-base)' }}>
            Compará el modelo tradicional con la agilidad y accesibilidad de Krea Nova.
          </p>
        </div>

        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table
            style={{
              width: '100%',
              minWidth: '580px',
              borderCollapse: 'collapse',
              fontSize: 'var(--text-sm)',
              background: 'var(--surface-glass)',
              border: '1px solid var(--table-border)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
            }}
          >
            <thead>
              <tr style={{ borderBottom: '1px solid var(--table-border)', background: 'var(--table-head-bg)' }}>
                <th style={{ padding: '18px 20px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Característica
                </th>
                <th style={{ padding: '18px 20px', textAlign: 'left', fontWeight: 600, color: 'var(--text-subtle)' }}>
                  Modelo Tradicional
                </th>
                <th style={{ padding: '18px 20px', textAlign: 'left', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Krea Nova
                </th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--table-border)' }}>
                <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text-primary)' }}>Ticket Mínimo</td>
                <td style={{ padding: '16px 20px', color: 'var(--text-subtle)' }}>$80.000 - $150.000 USD (Inaccesible)</td>
                <td style={{ padding: '16px 20px', color: 'var(--text-primary)', fontWeight: 600 }}>Desde $500 USD</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--table-border)' }}>
                <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text-primary)' }}>Liquidez y Salida</td>
                <td style={{ padding: '16px 20px', color: 'var(--text-subtle)' }}>Años de espera para vender la propiedad</td>
                <td style={{ padding: '16px 20px', color: 'var(--text-primary)', fontWeight: 600 }}>Inmediata en Mercado Secundario</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--table-border)' }}>
                <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text-primary)' }}>Trámites y Costos</td>
                <td style={{ padding: '16px 20px', color: 'var(--text-subtle)' }}>Comisiones inmobiliarias, escribanías, semanas</td>
                <td style={{ padding: '16px 20px', color: 'var(--text-primary)', fontWeight: 600 }}>100% digital en minutos</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--table-border)' }}>
                <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text-primary)' }}>Diversificación</td>
                <td style={{ padding: '16px 20px', color: 'var(--text-subtle)' }}>Todo el riesgo en una sola unidad</td>
                <td style={{ padding: '16px 20px', color: 'var(--text-primary)', fontWeight: 600 }}>Diversificable en múltiples obras</td>
              </tr>
              <tr>
                <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text-primary)' }}>Seguimiento</td>
                <td style={{ padding: '16px 20px', color: 'var(--text-subtle)' }}>Informes manuales o visitas presenciales</td>
                <td style={{ padding: '16px 20px', color: 'var(--text-primary)', fontWeight: 600 }}>Dashboard con hitos periciales en vivo</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FOOTER - CLEAN TYPOGRAPHY */}
      <footer
        style={{
          borderTop: '1px solid var(--surface-glass-border)',
          padding: '36px 24px',
          background: 'var(--surface-card)',
        }}
      >
        <div
          className="container-responsive"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '0.04em', color: 'var(--text-primary)' }}>
              KREA NOVA
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-subtle)', marginTop: '2px' }}>
              © 2026 Prototipo de Investigación y Proyecto Final.
            </span>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-subtle)', maxWidth: '480px', textAlign: 'right' }}>
            Entorno de demostración académica. No constituye oferta pública de valores ni asesoramiento financiero.
          </div>
        </div>
      </footer>
    </div>
  );
};
