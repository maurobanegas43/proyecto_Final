import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  MapPin,
  ShieldCheck,
  X,
  Building2,
} from 'lucide-react';
import { api } from '../../services/api';
import { Project } from '../../types';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    api.getProjects().then(setProjects);
  }, []);

  const filteredProjects = projects.filter((p) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'residential' && (p.category?.includes('Residencial') || p.name.includes('Residencias') || p.name.includes('Coliving'))) ||
      (filter === 'corporate' && (p.category?.includes('Corporativo') || p.category?.includes('Logística') || p.name.includes('Torre') || p.name.includes('Parque')));

    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: 'clamp(16px, 4vw, 32px)',
        paddingRight: 'clamp(16px, 4vw, 32px)',
        paddingTop: 'clamp(24px, 4vh, 48px)',
        paddingBottom: '80px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Centered Header Section */}
      <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 40px', width: '100%' }}>
        <h1
          style={{
            fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.035em',
            marginBottom: '16px',
            color: 'var(--text-primary)',
            fontWeight: 800,
          }}
        >
          Oportunidades de Inversión
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.125rem)',
            lineHeight: 1.65,
            color: 'var(--text-muted)',
            maxWidth: '680px',
            margin: '0 auto 36px',
          }}
        >
          Desarrollos premium auditados legal y técnicamente. Invertí desde{' '}
          <strong style={{ color: 'var(--text-primary)' }}>$500 USD</strong> con respaldo en fideicomiso y cobrá dividendos en dólares.
        </p>

        {/* Harmonic Search & Filter Control Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px', width: '100%' }}>
          {/* Centered, Generously Proportioned Search Bar */}
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Search
              size={19}
              style={{
                position: 'absolute',
                left: '20px',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
              }}
            />

            <input
              type="text"
              placeholder="Buscar por zona, ciudad o proyecto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                height: '52px',
                paddingLeft: '52px',
                paddingRight: searchTerm ? '46px' : '20px',
                fontSize: '15px',
                fontFamily: 'var(--font-body)',
                color: 'var(--text-primary)',
                background: 'var(--surface-card)',
                border: '1px solid var(--surface-glass-border)',
                borderRadius: '999px',
                boxShadow: 'var(--shadow-card)',
                outline: 'none',
                transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--text-primary)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--surface-glass-border)';
              }}
            />

            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  display: 'grid',
                  placeItems: 'center',
                  padding: '4px',
                }}
                title="Limpiar búsqueda"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Centered Category Pills */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <button
              onClick={() => setFilter('all')}
              style={{
                height: '40px',
                padding: '0 20px',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: '999px',
                cursor: 'pointer',
                border: '1px solid',
                borderColor: filter === 'all' ? 'transparent' : 'var(--surface-glass-border)',
                background: filter === 'all' ? 'var(--btn-primary-bg)' : 'var(--surface-card)',
                color: filter === 'all' ? 'var(--btn-primary-text)' : 'var(--text-muted)',
                transition: 'all var(--transition-fast)',
              }}
            >
              Todos ({projects.length})
            </button>

            <button
              onClick={() => setFilter('residential')}
              style={{
                height: '40px',
                padding: '0 20px',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: '999px',
                cursor: 'pointer',
                border: '1px solid',
                borderColor: filter === 'residential' ? 'transparent' : 'var(--surface-glass-border)',
                background: filter === 'residential' ? 'var(--btn-primary-bg)' : 'var(--surface-card)',
                color: filter === 'residential' ? 'var(--btn-primary-text)' : 'var(--text-muted)',
                transition: 'all var(--transition-fast)',
              }}
            >
              Residencial
            </button>

            <button
              onClick={() => setFilter('corporate')}
              style={{
                height: '40px',
                padding: '0 20px',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: '999px',
                cursor: 'pointer',
                border: '1px solid',
                borderColor: filter === 'corporate' ? 'transparent' : 'var(--surface-glass-border)',
                background: filter === 'corporate' ? 'var(--btn-primary-bg)' : 'var(--surface-card)',
                color: filter === 'corporate' ? 'var(--btn-primary-text)' : 'var(--text-muted)',
                transition: 'all var(--transition-fast)',
              }}
            >
              Corporativo & Logística
            </button>
          </div>
        </div>
      </div>

      {/* Catalog Cards Grid - auto-fill preserves identical column width regardless of filter count */}
      {filteredProjects.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '64px 24px',
            color: 'var(--text-muted)',
            background: 'var(--surface-card)',
            borderRadius: '20px',
            border: '1px solid var(--surface-glass-border)',
            width: '100%',
          }}
        >
          <Building2 size={44} style={{ margin: '0 auto 16px', opacity: 0.35 }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            No se encontraron oportunidades
          </h3>
          <p style={{ fontSize: '14px', maxWidth: '420px', margin: '0 auto 20px', lineHeight: 1.6 }}>
            No encontramos desarrollos que coincidan con la búsqueda o el filtro seleccionado.
          </p>
          <button
            onClick={() => {
              setFilter('all');
              setSearchTerm('');
            }}
            style={{
              height: '40px',
              padding: '0 22px',
              fontSize: '14px',
              fontWeight: 600,
              borderRadius: '999px',
              cursor: 'pointer',
              border: '1px solid var(--surface-glass-border)',
              background: 'var(--surface-card)',
              color: 'var(--text-primary)',
              transition: 'all var(--transition-fast)',
            }}
          >
            Restablecer filtros
          </button>
        </div>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map((p) => {
            const goalUSD = p.fundingGoal / 100;
            const raisedUSD = p.fundsRaised / 100;
            const cardImage =
              p.imageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80';

            return (
              <div
                key={p.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  overflow: 'hidden',
                  borderRadius: '20px',
                  border: '1px solid var(--surface-glass-border)',
                  background: 'var(--surface-card)',
                  boxShadow: 'var(--shadow-card)',
                  transition: 'transform var(--transition-fast), border-color var(--transition-fast)',
                }}
              >
              {/* Building Image Cover - Fixed 240px */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '240px',
                  minHeight: '240px',
                  maxHeight: '240px',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={cardImage}
                  alt={p.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />

                {/* Subtle dark gradient overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
                  }}
                />

                {/* Floating APY Pill */}
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(9, 9, 11, 0.92)',
                    color: '#ffffff',
                    backdropFilter: 'blur(10px)',
                    padding: '6px 14px',
                    borderRadius: '999px',
                    fontSize: '13px',
                    fontWeight: 800,
                    letterSpacing: '0.02em',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  {p.expectedApy || 12.5}% APY en USD
                </div>

                {/* Location on image */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '14px',
                    left: '18px',
                    right: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 500,
                    textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                  }}
                >
                  <MapPin size={15} style={{ flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.location}
                  </span>
                </div>
              </div>

              {/* Card Body - Perfectly balanced and equalized across all cards */}
              <div
                style={{
                  padding: 'clamp(20px, 3vw, 26px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '18px',
                  flex: 1,
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: '1.3rem',
                      fontWeight: 700,
                      letterSpacing: '-0.025em',
                      color: 'var(--text-primary)',
                      marginBottom: '8px',
                      lineHeight: 1.25,
                      height: '34px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {p.name}
                  </h2>
                  <p
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '14px',
                      lineHeight: 1.55,
                      height: '44px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      margin: 0,
                    }}
                  >
                    {p.description}
                  </p>
                </div>

                {/* Funding Progress Bar - Fixed Height */}
                <div style={{ display: 'grid', gap: '8px', minHeight: '38px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', lineHeight: '20px' }}>
                    <span style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Fondeado: <strong className="num" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>${raisedUSD.toLocaleString()} USD</strong>
                    </span>
                    <span className="num" style={{ fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                      {p.fundedPercent}% de ${goalUSD.toLocaleString()}
                    </span>
                  </div>
                  <div className="progress__track" style={{ height: '7px' }}>
                    <div
                      className="progress__fill"
                      style={{ width: `${Math.min(p.fundedPercent, 100)}%` }}
                    />
                  </div>
                </div>

                {/* 2 Essential Metrics: Ticket & Plazo - Fixed 72px */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    padding: '14px 18px',
                    height: '72px',
                    boxSizing: 'border-box',
                    background: 'var(--color-surface-raised)',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--text-subtle)', display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Ticket Mínimo
                    </span>
                    <strong className="num" style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: 700, display: 'block', marginTop: '2px' }}>
                      ${p.minInvestment || 500} USD
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-subtle)', display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Plazo Estimado
                    </span>
                    <strong className="num" style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: 700, display: 'block', marginTop: '2px' }}>
                      {p.durationMonths || 24} meses
                    </strong>
                  </div>
                </div>

                {/* CTA Action Footer - Pushed to bottom with marginTop: auto */}
                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-subtle)', fontWeight: 600 }}>
                    <ShieldCheck size={16} />
                    <span>Fideicomiso Inscripto</span>
                  </div>

                  <Link
                    to={`/app/projects/${p.id}`}
                    className="btn-primary"
                    style={{
                      height: '42px',
                      padding: '0 20px',
                      fontSize: '14px',
                      fontWeight: 600,
                      gap: '8px',
                      borderRadius: '10px',
                    }}
                  >
                    <span>Ver Proyecto</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
};
