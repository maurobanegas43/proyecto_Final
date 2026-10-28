import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Building2,
  ShieldCheck,
  Camera,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  FileDown,
  Ruler,
  DollarSign,
  CheckCircle2,
  Clock,
  Sparkles,
  Phone,
  Mail,
  Award,
} from 'lucide-react';
import { api } from '../../services/api';
import { Project, DeveloperProfile, ProjectImage } from '../../types';
import { generateProjectAuditPDF } from '../../services/pdfGenerator';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [developer, setDeveloper] = useState<DeveloperProfile | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'tracking' | 'budget' | 'architecture' | 'legal'>('tracking');
  const [budgetSubTab, setBudgetSubTab] = useState<'materials' | 'payroll' | 'equipment' | 'summary'>('materials');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      api.getProject(id).then((p) => {
        setProject(p || null);
        if (p?.developerId) {
          api.getDeveloper(p.developerId).then((dev) => setDeveloper(dev || null));
        }
      });
    }
  }, [id]);

  if (!project) {
    return (
      <div className="empty" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Proyecto no encontrado</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
          No pudimos localizar la información del desarrollo solicitado.
        </p>
        <Link to="/app/projects" className="btn btn--secondary">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const images: ProjectImage[] =
    project.images && project.images.length > 0
      ? project.images
      : [
          {
            url:
              project.imageUrl ||
              'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
            caption: 'Fachada y Render Arquitectónico Principal',
            category: 'render',
          },
        ];

  const activeImage = images[activePhotoIndex] || images[0];

  const handleNextPhoto = () => {
    setActivePhotoIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevPhoto = () => {
    setActivePhotoIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleDownloadPDF = () => {
    setIsGeneratingPDF(true);
    setTimeout(() => {
      try {
        generateProjectAuditPDF(project, developer);
      } finally {
        setIsGeneratingPDF(false);
      }
    }, 400);
  };

  const arch = project.architecturalSpecs;
  const constr = project.constructionData;
  const audit = project.budgetAudit;
  const totalBudget = audit?.totalBudgetUSD || (project.fundingGoal ? project.fundingGoal / 100 : 750000);
  const executedBudget = audit?.executedBudgetUSD || (totalBudget * (project.progress || 40)) / 100;
  const balanceRemaining = totalBudget - executedBudget;

  const budgetItems = audit?.budgetItems || [];
  const materialItems = budgetItems.filter((b) => b.category === 'material');
  const payrollItems = budgetItems.filter((b) => b.category === 'payroll');
  const equipmentItems = budgetItems.filter((b) => b.category === 'equipment');

  return (
    <div className="stack" style={{ gap: '28px' }}>
      {/* Back button and breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link
          to="/app/projects"
          className="btn btn--ghost btn--sm"
          style={{ paddingLeft: 0, color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={16} />
          Volver al catálogo de proyectos
        </Link>

        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          className="btn btn--primary btn--sm"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '10px' }}
        >
          <FileDown size={15} />
          <span>{isGeneratingPDF ? 'Generando PDF Oficial...' : 'Descargar Presupuesto & Auditoría (.PDF)'}</span>
        </button>
      </div>

      {/* Main Header with Friendly Copywriting */}
      <div className="page-header" style={{ marginBottom: '4px' }}>
        <div className="page-header__text">
          <div className="row" style={{ gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
            <span className="badge badge--solid mono">{project.tokenSymbol || 'TKN'}</span>
            <span className="badge badge--strong">Contrato Fiduciario ID: FID-{project.id.toUpperCase()}</span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#10b981',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              <ShieldCheck size={14} />
              Auditoría Técnica en Campo Aprobada
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, marginBottom: '8px' }}>
            {project.name}
          </h1>

          <p className="row" style={{ gap: '6px', color: 'var(--color-text-muted)', fontSize: '15px' }}>
            <MapPin size={16} style={{ color: 'var(--brand-gold)' }} />
            <span>{project.location}</span>
            <span style={{ margin: '0 4px', opacity: 0.4 }}>•</span>
            <span>{project.category || 'Desarrollo Inmobiliario Integral'}</span>
          </p>
        </div>
      </div>

      {/* Building Photo Gallery Component */}
      <div
        className="card"
        style={{
          overflow: 'hidden',
          padding: 0,
          borderRadius: '24px',
          border: '1px solid var(--surface-glass-border)',
          background: 'var(--surface-card)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {/* Featured Image Viewer */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(280px, 48vh, 460px)',
            background: '#09090b',
            overflow: 'hidden',
          }}
        >
          <img
            src={activeImage.url}
            alt={activeImage.caption}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'opacity 200ms ease',
            }}
          />

          {/* Gradient Bottom Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Photo Category Pill */}
          <div
            style={{
              position: 'absolute',
              top: '18px',
              left: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                background: 'rgba(9, 9, 11, 0.85)',
                backdropFilter: 'blur(10px)',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Camera size={13} style={{ color: 'var(--brand-gold)' }} />
              {activeImage.category === 'render'
                ? 'Render Arquitectónico'
                : activeImage.category === 'construction'
                ? 'Avance de Obra Real'
                : activeImage.category === 'interior'
                ? 'Interiores & Unidades'
                : activeImage.category === 'amenity'
                ? 'Amenities & Áreas Comunes'
                : 'Registro de Obra'}
            </span>

            <span
              style={{
                background: 'rgba(0,0,0,0.6)',
                color: 'rgba(255,255,255,0.85)',
                padding: '6px 10px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              {activePhotoIndex + 1} de {images.length}
            </span>
          </div>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            title="Ver en pantalla completa"
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              background: 'rgba(9, 9, 11, 0.8)',
              backdropFilter: 'blur(8px)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '10px',
              width: '38px',
              height: '38px',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              transition: 'background 150ms ease',
            }}
          >
            <Maximize2 size={16} />
          </button>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevPhoto}
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(9, 9, 11, 0.75)',
                  backdropFilter: 'blur(6px)',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: '50%',
                  width: '42px',
                  height: '42px',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                onClick={handleNextPhoto}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(9, 9, 11, 0.75)',
                  backdropFilter: 'blur(6px)',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: '50%',
                  width: '42px',
                  height: '42px',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Caption Overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: '18px',
              left: '20px',
              right: '20px',
              color: '#ffffff',
            }}
          >
            <p
              style={{
                fontSize: '15px',
                fontWeight: 600,
                textShadow: '0 2px 6px rgba(0,0,0,0.9)',
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              {activeImage.caption}
            </p>
          </div>
        </div>

        {/* Thumbnail Carousel Strip */}
        {images.length > 1 && (
          <div
            style={{
              padding: '14px 18px',
              background: 'var(--color-surface-raised)',
              display: 'flex',
              gap: '12px',
              overflowX: 'auto',
              borderTop: '1px solid var(--surface-glass-border)',
            }}
          >
            {images.map((img, idx) => {
              const isSelected = idx === activePhotoIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActivePhotoIndex(idx)}
                  style={{
                    flexShrink: 0,
                    width: '84px',
                    height: '56px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    padding: 0,
                    cursor: 'pointer',
                    border: `2px solid ${isSelected ? 'var(--brand-gold)' : 'transparent'}`,
                    opacity: isSelected ? 1 : 0.65,
                    transition: 'all 150ms ease',
                    background: '#000',
                  }}
                >
                  <img
                    src={img.url}
                    alt={img.caption}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Grid: Comprehensive Dossier (Left) vs Real Estate Actor Cards (Right) */}
      <div className="grid-2-1" style={{ alignItems: 'start', gap: '28px' }}>
        {/* Left Column: Interactive Audit Dossier with Tabs */}
        <div className="stack" style={{ gap: '24px' }}>
          {/* Main Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              background: 'var(--color-surface-raised)',
              padding: '6px',
              borderRadius: '16px',
              border: '1px solid var(--surface-glass-border)',
              overflowX: 'auto',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('tracking')}
              style={{
                flex: 1,
                minWidth: '160px',
                padding: '10px 16px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'tracking' ? 'var(--surface-card)' : 'transparent',
                color: activeTab === 'tracking' ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: activeTab === 'tracking' ? 700 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: activeTab === 'tracking' ? 'var(--shadow-elevation)' : 'none',
                transition: 'all 150ms ease',
              }}
            >
              <Clock size={16} style={{ color: activeTab === 'tracking' ? 'var(--brand-gold)' : 'inherit' }} />
              <span>Seguimiento Real ({project.progress}%)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('budget')}
              style={{
                flex: 1,
                minWidth: '160px',
                padding: '10px 16px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'budget' ? 'var(--surface-card)' : 'transparent',
                color: activeTab === 'budget' ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: activeTab === 'budget' ? 700 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: activeTab === 'budget' ? 'var(--shadow-elevation)' : 'none',
                transition: 'all 150ms ease',
              }}
            >
              <DollarSign size={16} style={{ color: activeTab === 'budget' ? 'var(--brand-gold)' : 'inherit' }} />
              <span>Presupuesto & Gastos</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('architecture')}
              style={{
                flex: 1,
                minWidth: '160px',
                padding: '10px 16px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'architecture' ? 'var(--surface-card)' : 'transparent',
                color: activeTab === 'architecture' ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: activeTab === 'architecture' ? 700 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: activeTab === 'architecture' ? 'var(--shadow-elevation)' : 'none',
                transition: 'all 150ms ease',
              }}
            >
              <Ruler size={16} style={{ color: activeTab === 'architecture' ? 'var(--brand-gold)' : 'inherit' }} />
              <span>Arquitectura & Obra</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('legal')}
              style={{
                flex: 1,
                minWidth: '160px',
                padding: '10px 16px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'legal' ? 'var(--surface-card)' : 'transparent',
                color: activeTab === 'legal' ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: activeTab === 'legal' ? 700 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: activeTab === 'legal' ? 'var(--shadow-elevation)' : 'none',
                transition: 'all 150ms ease',
              }}
            >
              <ShieldCheck size={16} style={{ color: activeTab === 'legal' ? 'var(--brand-gold)' : 'inherit' }} />
              <span>Marco Legal & Fiduciario</span>
            </button>
          </div>

          {/* TAB 1: SEGUIMIENTO REAL DE OBRA (CHRONOLOGICAL TIMELINE) */}
          {activeTab === 'tracking' && (
            <div className="card" style={{ padding: '24px', borderRadius: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Sparkles size={18} style={{ color: 'var(--brand-gold)' }} />
                    <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                      Bitácora y Certificaciones Reales de Obra
                    </h2>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                    Cada hito es inspeccionado en terreno y auditado con ensayos de laboratorio antes de autorizar el siguiente desembolso.
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981' }}>
                    {project.progress}%
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Avance Real Certificado</span>
                </div>
              </div>

              {/* Progress Bar with Milestones */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ height: '8px', background: 'var(--color-surface-raised)', borderRadius: '999px', overflow: 'hidden', position: 'relative' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${project.progress}%`,
                      background: 'linear-gradient(90deg, var(--brand-gold) 0%, #10b981 100%)',
                      borderRadius: '999px',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span>Inicio: {constr?.workStartDate || 'Enero 2026'}</span>
                  <span>Entrega Estimada: {constr?.estimatedDeliveryDate || 'Diciembre 2027'}</span>
                </div>
              </div>

              {/* Milestones Timeline */}
              <div style={{ display: 'grid', gap: '20px', position: 'relative', paddingLeft: '28px' }}>
                {/* Vertical Timeline Guide */}
                <div
                  style={{
                    position: 'absolute',
                    left: '11px',
                    top: '8px',
                    bottom: '8px',
                    width: '2px',
                    background: 'var(--surface-glass-border)',
                  }}
                />

                {(project.progressMilestones || []).map((m) => {
                  const isDone = m.status === 'completed';
                  const isCurrent = m.status === 'in_progress';

                  return (
                    <div key={m.id} style={{ position: 'relative' }}>
                      {/* Node Icon */}
                      <div
                        style={{
                          position: 'absolute',
                          left: '-28px',
                          top: '2px',
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          background: isDone
                            ? '#10b981'
                            : isCurrent
                            ? 'var(--brand-gold)'
                            : 'var(--surface-card)',
                          border: `2px solid ${
                            isDone ? '#10b981' : isCurrent ? 'var(--brand-gold)' : 'var(--text-muted)'
                          }`,
                          display: 'grid',
                          placeItems: 'center',
                          color: '#fff',
                        }}
                      >
                        {isDone ? (
                          <CheckCircle2 size={13} />
                        ) : isCurrent ? (
                          <Clock size={12} />
                        ) : (
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)' }} />
                        )}
                      </div>

                      {/* Content Card */}
                      <div
                        style={{
                          background: 'var(--color-surface-raised)',
                          padding: '16px',
                          borderRadius: '14px',
                          border: '1px solid var(--surface-glass-border)',
                          display: 'grid',
                          gap: '6px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px', color: 'var(--brand-gold)', fontWeight: 700, textTransform: 'uppercase' }}>
                            {m.phase} • {m.date}
                          </span>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '6px',
                              background: isDone
                                ? 'rgba(16, 185, 129, 0.15)'
                                : isCurrent
                                ? 'rgba(217, 119, 6, 0.15)'
                                : 'rgba(255,255,255,0.05)',
                              color: isDone ? '#10b981' : isCurrent ? '#f59e0b' : 'var(--text-muted)',
                            }}
                          >
                            {isDone ? 'Completado (100%)' : isCurrent ? `En Ejecución (${m.percentage}%)` : 'Próxima Etapa'}
                          </span>
                        </div>

                        <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                          {m.title}
                        </h3>

                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                          {m.reportSummary}
                        </p>

                        <div
                          style={{
                            marginTop: '6px',
                            paddingTop: '8px',
                            borderTop: '1px solid var(--surface-glass-border)',
                            fontSize: '11px',
                            color: 'var(--text-subtle)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '8px',
                          }}
                        >
                          <span><strong>Detalle pericial:</strong> {m.technicalDetails}</span>
                          <span style={{ color: 'var(--text-muted)' }}>Inspector: {m.inspector}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: PRESUPUESTO Y RENDICIÓN DETALLADA (ITEM POR ITEM) */}
          {activeTab === 'budget' && (
            <div className="card" style={{ padding: '24px', borderRadius: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    Rendición de Cuentas y Presupuesto de Obra
                  </h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                    Registro transparente de cada material adquirido, sueldo pagado a operarios y equipamiento utilizado.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                  className="btn btn--primary btn--sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '10px' }}
                >
                  <FileDown size={15} />
                  <span>{isGeneratingPDF ? 'Generando...' : 'Descargar Balance (.PDF)'}</span>
                </button>
              </div>

              {/* Financial Dashboard Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '12px',
                  marginBottom: '24px',
                }}
              >
                <div style={{ background: 'var(--color-surface-raised)', padding: '16px', borderRadius: '12px', border: '1px solid var(--surface-glass-border)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Presupuesto Total</span>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                    ${totalBudget.toLocaleString()} USD
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>Fideicomiso al costo auditado</span>
                </div>

                <div style={{ background: 'var(--color-surface-raised)', padding: '16px', borderRadius: '12px', border: '1px solid var(--surface-glass-border)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ejecutado a la Fecha</span>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--brand-gold)', marginTop: '4px' }}>
                    ${executedBudget.toLocaleString()} USD
                  </div>
                  <span style={{ fontSize: '11px', color: '#10b981' }}>{((executedBudget / totalBudget) * 100).toFixed(1)}% del presupuesto</span>
                </div>

                <div style={{ background: 'var(--color-surface-raised)', padding: '16px', borderRadius: '12px', border: '1px solid var(--surface-glass-border)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Saldo en Custodia</span>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                    ${balanceRemaining.toLocaleString()} USD
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>En cuenta bancaria remunerada</span>
                </div>
              </div>

              {/* Sub-tabs for granular inspection */}
              <div
                style={{
                  display: 'flex',
                  gap: '6px',
                  borderBottom: '1px solid var(--surface-glass-border)',
                  marginBottom: '16px',
                  paddingBottom: '8px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setBudgetSubTab('materials')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: budgetSubTab === 'materials' ? 'var(--color-surface-raised)' : 'transparent',
                    color: budgetSubTab === 'materials' ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontWeight: 600,
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  Materiales ({materialItems.length})
                </button>
                <button
                  type="button"
                  onClick={() => setBudgetSubTab('payroll')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: budgetSubTab === 'payroll' ? 'var(--color-surface-raised)' : 'transparent',
                    color: budgetSubTab === 'payroll' ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontWeight: 600,
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  Sueldos & Cargas UOCRA ({payrollItems.length})
                </button>
                <button
                  type="button"
                  onClick={() => setBudgetSubTab('equipment')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: budgetSubTab === 'equipment' ? 'var(--color-surface-raised)' : 'transparent',
                    color: budgetSubTab === 'equipment' ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontWeight: 600,
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  Maquinaria & Equipos ({equipmentItems.length})
                </button>
                <button
                  type="button"
                  onClick={() => setBudgetSubTab('summary')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: budgetSubTab === 'summary' ? 'var(--color-surface-raised)' : 'transparent',
                    color: budgetSubTab === 'summary' ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontWeight: 600,
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  Rubros Generales
                </button>
              </div>

              {/* Table rendering based on subtab */}
              {budgetSubTab === 'materials' && (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--surface-glass-border)', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>
                        <th style={{ padding: '8px 10px' }}>Material / Concepto</th>
                        <th style={{ padding: '8px 10px' }}>Cantidad</th>
                        <th style={{ padding: '8px 10px' }}>Precio Unit.</th>
                        <th style={{ padding: '8px 10px' }}>Proveedor / Comprobante</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>Total USD</th>
                      </tr>
                    </thead>
                    <tbody>
                      {materialItems.map((m) => (
                        <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '10px' }}>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{m.concept}</div>
                            <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>{m.details}</span>
                          </td>
                          <td style={{ padding: '10px', color: 'var(--text-muted)' }}>
                            {m.quantity ? m.quantity.toLocaleString() : '-'} {m.unit || ''}
                          </td>
                          <td style={{ padding: '10px', color: 'var(--text-muted)' }}>
                            {m.unitPriceUSD ? `$${m.unitPriceUSD}` : '-'}
                          </td>
                          <td style={{ padding: '10px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{m.recipientOrSupplier}</span>
                          </td>
                          <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700, color: 'var(--brand-gold)' }}>
                            ${m.totalUSD.toLocaleString()} USD
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {budgetSubTab === 'payroll' && (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--surface-glass-border)', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>
                        <th style={{ padding: '8px 10px' }}>Categoría Laboral</th>
                        <th style={{ padding: '8px 10px' }}>Dotación / Período</th>
                        <th style={{ padding: '8px 10px' }}>Comprobante de Pago</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>Total Liquidado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payrollItems.map((p) => (
                        <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '10px' }}>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.concept}</div>
                          </td>
                          <td style={{ padding: '10px', color: 'var(--text-muted)' }}>
                            {p.details}
                          </td>
                          <td style={{ padding: '10px', color: 'var(--text-subtle)', fontSize: '12px' }}>
                            {p.recipientOrSupplier} ({p.receiptNumber})
                          </td>
                          <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700, color: '#10b981' }}>
                            ${p.totalUSD.toLocaleString()} USD
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {budgetSubTab === 'equipment' && (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--surface-glass-border)', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>
                        <th style={{ padding: '8px 10px' }}>Maquinaria / Equipo</th>
                        <th style={{ padding: '8px 10px' }}>Servicio Prestado</th>
                        <th style={{ padding: '8px 10px' }}>Empresa Prestadora</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>Total Facturado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {equipmentItems.map((eq) => (
                        <tr key={eq.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '10px' }}>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{eq.concept}</div>
                          </td>
                          <td style={{ padding: '10px', color: 'var(--text-muted)' }}>
                            {eq.details}
                          </td>
                          <td style={{ padding: '10px', color: 'var(--text-subtle)', fontSize: '12px' }}>
                            {eq.recipientOrSupplier}
                          </td>
                          <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700, color: 'var(--text-primary)' }}>
                            ${eq.totalUSD.toLocaleString()} USD
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {budgetSubTab === 'summary' && (
                <div style={{ display: 'grid', gap: '10px' }}>
                  {(audit?.rubrosSummary || []).map((r, idx) => (
                    <div key={idx} style={{ background: 'var(--color-surface-raised)', padding: '12px 16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>{r.rubro}</span>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--brand-gold)' }}>
                          ${r.executedUSD.toLocaleString()} / ${r.budgetedUSD.toLocaleString()} USD
                        </span>
                        <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>
                          {r.percentage}% ejecutado
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ARQUITECTURA Y DATOS DE LA OBRA */}
          {activeTab === 'architecture' && (
            <div className="card" style={{ padding: '24px', borderRadius: '20px', display: 'grid', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                  Memoria de Arquitectura & Especificaciones Técnicas
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
                  {arch?.designConcept || project.description}
                </p>
              </div>

              {/* Technical Specifications Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '14px',
                }}
              >
                <div style={{ background: 'var(--color-surface-raised)', padding: '16px', borderRadius: '12px', border: '1px solid var(--surface-glass-border)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Estudio de Arquitectura</span>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)', marginTop: '4px' }}>
                    {arch?.studioName || 'BMA Arquitectos'}
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>{arch?.leadArchitect}</span>
                </div>

                <div style={{ background: 'var(--color-surface-raised)', padding: '16px', borderRadius: '12px', border: '1px solid var(--surface-glass-border)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Cálculo Estructural</span>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)', marginTop: '4px' }}>
                    {arch?.structuralEngineer || 'Ingeniería Estructural Avanzada'}
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>Norma CIRSOC 201/103</span>
                </div>

                <div style={{ background: 'var(--color-surface-raised)', padding: '16px', borderRadius: '12px', border: '1px solid var(--surface-glass-border)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Constructora Principal</span>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)', marginTop: '4px' }}>
                    {constr?.generalContractor || 'CRIBA S.A.'}
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>Empresa contratista general</span>
                </div>

                <div style={{ background: 'var(--color-surface-raised)', padding: '16px', borderRadius: '12px', border: '1px solid var(--surface-glass-border)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Auditoría Pericial Externa</span>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#10b981', marginTop: '4px' }}>
                    {constr?.technicalAuditor || 'Bureau Veritas Argentina'}
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>Control técnico independiente</span>
                </div>
              </div>

              {/* Dimensions and Metrics */}
              <div
                style={{
                  background: 'var(--color-surface-raised)',
                  padding: '20px',
                  borderRadius: '16px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '16px',
                  border: '1px solid var(--surface-glass-border)',
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Superficie Total</span>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    +{arch?.totalBuiltAreaM2.toLocaleString() || '14.850'} m²
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Superficie Vendible</span>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {arch?.sellableAreaM2.toLocaleString() || '11.200'} m²
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Plantas & Altura</span>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {arch?.floorsCount || 22} pisos ({arch?.subfloorsCount || 2} subsuelos)
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Sustentabilidad</span>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#10b981' }}>
                    {arch?.sustainabilityRating || 'LEED Gold'}
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
                  Amenities y Equipamiento Común
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  {arch?.amenitiesDescription || 'Rooftop lounge, cowork, piscina climatizada, seguridad 24/7 y bicicleteros.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: MARCO LEGAL Y FIDUCIARIO */}
          {activeTab === 'legal' && (
            <div className="card" style={{ padding: '24px', borderRadius: '20px', display: 'grid', gap: '20px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                  Garantías Jurídicas y Protección Fiduciaria
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
                  Estructuración legal bajo la Ley 24.441 de Fideicomisos, protegiendo el patrimonio del desarrollo frente a cualquier contingencia externa.
                </p>
              </div>

              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ background: 'var(--color-surface-raised)', padding: '16px', borderRadius: '12px', border: '1px solid var(--surface-glass-border)' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>
                    Fiduciario Público Registrado
                  </div>
                  <div style={{ color: 'var(--brand-gold)', fontWeight: 600, fontSize: '13px', marginTop: '2px' }}>
                    {constr?.fiduciaryTrustee || 'Banco de Valores S.A.'}
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '6px 0 0 0', lineHeight: 1.4 }}>
                    Custodia independiente de los fondos y del dominio del terreno. Los fondos se liberan únicamente por certificación de avance físico emitida por el auditor.
                  </p>
                </div>

                <div style={{ background: 'var(--color-surface-raised)', padding: '16px', borderRadius: '12px', border: '1px solid var(--surface-glass-border)' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>
                    Póliza de Seguro Todo Riesgo Construcción
                  </div>
                  <div style={{ color: 'var(--text-primary)', fontSize: '13px', marginTop: '2px' }}>
                    {constr?.insurancePolicy || 'La Holando Sudamericana #992144'}
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '6px 0 0 0', lineHeight: 1.4 }}>
                    Cobertura total frente a siniestros, daños materiales durante la obra y responsabilidad civil frente a linderos.
                  </p>
                </div>

                <div style={{ background: 'var(--color-surface-raised)', padding: '16px', borderRadius: '12px', border: '1px solid var(--surface-glass-border)' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>
                    Permiso de Obra y Registro Notarial
                  </div>
                  <div style={{ color: 'var(--text-primary)', fontSize: '13px', marginTop: '2px' }}>
                    Expediente: <span className="mono">{constr?.permitNumber || 'EXP-CABA-88192/2025'}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-subtle)', marginTop: '4px' }}>
                    Escribanía interviniente: {constr?.notaryPublic || 'Escribanía Zabaleta & Asoc. (Reg. 412 CABA)'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Inmobiliaria Card + Key Summary + Action Card */}
        <div className="stack" style={{ gap: '20px' }}>
          {/* Developer / Inmobiliaria Profile Card */}
          {developer && (
            <div
              className="card"
              style={{
                borderRadius: '20px',
                border: '1px solid var(--surface-glass-border)',
                background: 'var(--surface-card)',
                padding: '22px',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(180, 140, 60, 0.15)',
                      display: 'grid',
                      placeItems: 'center',
                      color: 'var(--brand-gold)',
                    }}
                  >
                    <Building2 size={22} />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Inmobiliaria a Cargo
                    </span>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                      {developer.tradeName || developer.companyName}
                    </h3>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: 'var(--color-surface-raised)',
                    border: '1px solid var(--surface-glass-border)',
                    color: 'var(--brand-gold)',
                  }}
                >
                  {developer.companyType}
                </span>
              </div>

              <div style={{ display: 'grid', gap: '10px', fontSize: '13px', marginBottom: '18px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Razón Social:</span>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{developer.companyName}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>CUIT:</span>
                  <span className="mono" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{developer.cuit}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Representante:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{developer.repFullName}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>M² Entregados:</span>
                  <strong style={{ color: 'var(--brand-gold)' }}>+{developer.deliveredM2.toLocaleString()} m²</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Trayectoria:</span>
                  <span style={{ fontWeight: 600 }}>{developer.completedProjects} obras finalizadas</span>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '16px',
                }}
              >
                <ShieldCheck size={18} style={{ color: '#10b981', flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600, lineHeight: 1.3 }}>
                  Legajo corporativo, balance y capacidad técnica homologados en Krea Nova.
                </span>
              </div>

              <div style={{ display: 'grid', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={13} style={{ color: 'var(--brand-gold)' }} />
                  <span>{developer.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={13} style={{ color: 'var(--brand-gold)' }} />
                  <span>{developer.phone}</span>
                </div>
              </div>
            </div>
          )}

          {/* Download Official Audit Report PDF Action Card */}
          <div
            className="card"
            style={{
              borderRadius: '20px',
              border: '1px solid rgba(180, 140, 60, 0.3)',
              background: 'linear-gradient(180deg, var(--surface-card) 0%, rgba(180, 140, 60, 0.06) 100%)',
              padding: '24px',
              boxShadow: 'var(--shadow-card)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(180, 140, 60, 0.15)',
                color: 'var(--brand-gold)',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 14px',
              }}
            >
              <FileDown size={24} />
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
              Presupuesto Oficial Auditado
            </h3>

            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 18px 0' }}>
              Descargá el documento completo en formato PDF con la nómina salarial UOCRA, materiales comprados, facturas y certificación de peritos.
            </p>

            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="btn btn--primary btn--block btn--lg"
              style={{
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <FileDown size={16} />
              <span>{isGeneratingPDF ? 'Generando PDF...' : 'Descargar Archivo PDF'}</span>
            </button>

            <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-subtle)', marginTop: '12px' }}>
              Hash de seguridad SHA-256 verificado por Bureau Veritas
            </span>
          </div>

          {/* Friendly FAQ / Transparency Note */}
          <div
            className="card"
            style={{
              borderRadius: '16px',
              padding: '18px',
              background: 'var(--color-surface-raised)',
              border: '1px solid var(--surface-glass-border)',
              display: 'grid',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={16} style={{ color: 'var(--brand-gold)' }} />
              <h4 style={{ fontSize: '13px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                ¿Cómo cuidamos tu capital?
              </h4>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Los fondos permanecen en una cuenta fiduciaria en el banco. La desarrolladora no recibe dinero por adelantado: solo se le reembolsa contra factura y certificado de obra aprobado por perito.
            </p>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.92)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px',
          }}
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={22} />
          </button>

          {/* Modal Image */}
          <div
            style={{
              maxWidth: '1100px',
              maxHeight: '75vh',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeImage.url}
              alt={activeImage.caption}
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
                borderRadius: '12px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.9)',
              }}
            />
            <p
              style={{
                color: '#fff',
                fontSize: '16px',
                fontWeight: 600,
                marginTop: '16px',
                textAlign: 'center',
              }}
            >
              {activeImage.caption}
            </p>
          </div>

          {/* Navigation Arrows inside Lightbox */}
          {images.length > 1 && (
            <div
              style={{ display: 'flex', gap: '20px', marginTop: '16px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={handlePrevPhoto}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: '50%',
                  width: '44px',
                  height: '44px',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                onClick={handleNextPhoto}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: '50%',
                  width: '44px',
                  height: '44px',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <ChevronRight size={22} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
