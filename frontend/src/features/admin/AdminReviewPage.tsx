import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, FileSpreadsheet } from 'lucide-react';
import { api } from '../../services/api';
import { Project } from '../../types';

export const AdminReviewPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedId, setSelectedId] = useState<string>('proj-004');
  const [reviewNote, setReviewNote] = useState('');
  const [actionDone, setActionDone] = useState<string | null>(null);

  useEffect(() => {
    api.getProjects().then((list) => {
      setProjects(list);
    });
  }, []);

  const selectedProject = projects.find((p) => p.id === selectedId) || projects[0];

  const handleApprove = () => {
    if (!selectedProject) return;
    selectedProject.status = 'approved';
    setProjects([...projects]);
    setActionDone(`El proyecto "${selectedProject.name}" fue APROBADO por el comité.`);
  };

  const handleReject = () => {
    if (!selectedProject) return;
    selectedProject.status = 'rejected';
    setProjects([...projects]);
    setActionDone(`El proyecto "${selectedProject.name}" fue RECHAZADO.`);
  };

  return (
    <div className="stack">
      {/* Header */}
      <div className="page-header">
        <div className="page-header__text">
          <span className="eyebrow">Comité de Riesgo & Cumplimiento</span>
          <h1>Due Diligence & Aprobación de Proyectos</h1>
          <p>
            Módulo de evaluación técnica, jurídica y financiera previa a la publicación. Los
            cuestionarios de estructura variable y checklist se persisten en MongoDB.
          </p>
        </div>
      </div>

      {actionDone && (
        <div
          className="card"
          style={{
            background: 'var(--gray-900)',
            borderColor: 'var(--gray-600)',
            padding: 'var(--space-4)',
          }}
        >
          <div className="row row--between">
            <span style={{ fontWeight: 500 }}>{actionDone}</span>
            <button className="btn btn--ghost btn--sm" onClick={() => setActionDone(null)}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      <div className="grid-2-1">
        {/* Left Column: Due Diligence Dossier */}
        <div className="stack">
          {selectedProject ? (
            <>
              <div className="card">
                <div className="card__header">
                  <div>
                    <span className="eyebrow">Expediente de Revisión</span>
                    <h2 className="card__title">{selectedProject.name}</h2>
                    <span className="subtle" style={{ fontSize: 'var(--text-xs)' }}>
                      Desarrolladora: {selectedProject.developerId} • {selectedProject.location}
                    </span>
                  </div>
                  <span className="badge badge--strong" style={{ textTransform: 'uppercase' }}>
                    Estado: {selectedProject.status}
                  </span>
                </div>

                <div className="card__body" style={{ display: 'grid', gap: 'var(--space-4)' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-sm)', marginBottom: '8px' }}>
                      Cuestionario de Due Diligence (Almacenamiento Documental en MongoDB)
                    </h3>
                    <p className="subtle" style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-3)' }}>
                      Estructura flexible en MongoDB que permite versionar preguntas técnicas y formularios
                      específicos para cada tipología de desarrollo.
                    </p>

                    <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                      <div
                        style={{
                          background: 'var(--color-surface-raised)',
                          padding: 'var(--space-3)',
                          borderRadius: 'var(--radius-md)',
                          display: 'grid',
                          gap: '6px',
                        }}
                      >
                        <div className="row row--between">
                          <span style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>
                            1. Titularidad del Terreno y Factibilidad de Obra
                          </span>
                          <span className="badge badge--solid" style={{ fontSize: '10px' }}>Conforme</span>
                        </div>
                        <p className="subtle" style={{ fontSize: 'var(--text-xs)' }}>
                          Escritura inscripta en Registro de la Propiedad Inmueble. Planos de obra con permiso
                          aprobado por el municipio.
                        </p>
                      </div>

                      <div
                        style={{
                          background: 'var(--color-surface-raised)',
                          padding: 'var(--space-3)',
                          borderRadius: 'var(--radius-md)',
                          display: 'grid',
                          gap: '6px',
                        }}
                      >
                        <div className="row row--between">
                          <span style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>
                            2. Capacidad Financiera y Avales de la Desarrolladora
                          </span>
                          <span className="badge badge--solid" style={{ fontSize: '10px' }}>Conforme</span>
                        </div>
                        <p className="subtle" style={{ fontSize: 'var(--text-xs)' }}>
                          Estados contables auditados de los últimos 2 ejercicios. Historial de 5 obras entregadas
                          en plazo.
                        </p>
                      </div>

                      <div
                        style={{
                          background: 'var(--color-surface-raised)',
                          padding: 'var(--space-3)',
                          borderRadius: 'var(--radius-md)',
                          display: 'grid',
                          gap: '6px',
                        }}
                      >
                        <div className="row row--between">
                          <span style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>
                            3. Viabilidad de Costos y Rentabilidad Estimada
                          </span>
                          <span className="badge badge--outline" style={{ fontSize: '10px' }}>En Evaluación</span>
                        </div>
                        <p className="subtle" style={{ fontSize: 'var(--text-xs)' }}>
                          Presupuesto de cómputo y métricas de absorción de mercado coherentes con el APY declarado.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="field">
                    <label className="field__label">Dictamen y Observaciones del Revisor</label>
                    <textarea
                      className="input"
                      style={{ height: '90px', padding: 'var(--space-2) var(--space-3)', resize: 'vertical' }}
                      placeholder="Ingrese los fundamentos técnicos o legales para la decisión..."
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                    />
                  </div>

                  <div className="row row--between" style={{ paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-border)' }}>
                    <button className="btn btn--ghost" onClick={handleReject}>
                      <XCircle size={16} />
                      Rechazar Proyecto
                    </button>
                    <div className="row" style={{ gap: '8px' }}>
                      <button className="btn btn--secondary">
                        Solicitar Correcciones
                      </button>
                      <button className="btn btn--primary" onClick={handleApprove}>
                        <CheckCircle2 size={16} />
                        Aprobar para Emisión
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="empty">Seleccione un proyecto para revisar</div>
          )}
        </div>

        {/* Right Column: Queue of Projects to Review */}
        <div className="stack">
          <div className="card">
            <div className="card__header">
              <div className="row">
                <FileSpreadsheet size={18} className="muted" />
                <h2 className="card__title">Cola de Proyectos</h2>
              </div>
            </div>
            <div className="card__body" style={{ padding: 0 }}>
              <div style={{ display: 'grid' }}>
                {projects.map((p) => {
                  const isSelected = p.id === selectedId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedId(p.id)}
                      style={{
                        padding: 'var(--space-4) var(--space-5)',
                        border: 0,
                        borderBottom: '1px solid var(--color-border)',
                        background: isSelected ? 'var(--color-surface-raised)' : 'transparent',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'grid',
                        gap: '4px',
                        borderLeft: isSelected ? '3px solid var(--color-accent)' : '3px solid transparent',
                      }}
                    >
                      <div className="row row--between">
                        <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
                          {p.name}
                        </span>
                        <span className="badge badge--strong" style={{ fontSize: '10px' }}>
                          {p.status}
                        </span>
                      </div>
                      <span className="subtle" style={{ fontSize: 'var(--text-xs)' }}>
                        {p.location} • ${(p.fundingGoal / 100).toLocaleString()} USD
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
