import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Coins,
  FileText,
  MapPin,
} from 'lucide-react';
import { api } from '../../services/api';
import { Project } from '../../types';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [investAmount, setInvestAmount] = useState<number>(1000);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSuccess, setSimulationSuccess] = useState<{
    txHash: string;
    tokens: number;
    amount: number;
  } | null>(null);

  useEffect(() => {
    if (id) {
      api.getProject(id).then((p) => setProject(p || null));
    }
  }, [id]);

  if (!project) {
    return (
      <div className="empty">
        <p>Proyecto no encontrado</p>
        <Link to="/projects" className="btn btn--secondary">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const goalUSD = project.fundingGoal / 100;
  const raisedUSD = project.fundsRaised / 100;
  const tokenPrice = 100; // 1 token = 100 USD (simulado)
  const tokensToReceive = Math.floor(investAmount / tokenPrice);
  const quarterlyYield = ((investAmount * (project.expectedApy || 12)) / 100 / 4).toFixed(2);

  const handleSimulateInvestment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (investAmount <= 0) return;
    setIsSimulating(true);

    // Simulate network delay and outbox confirmation
    setTimeout(async () => {
      const inv = await api.simulateInvestment(project.id, investAmount);
      setIsSimulating(false);
      setSimulationSuccess({
        txHash: inv.simulatedTxHash,
        tokens: inv.tokens,
        amount: inv.amount,
      });
    }, 900);
  };

  return (
    <div className="stack">
      {/* Back button */}
      <div>
        <Link to="/app/projects" className="btn btn--ghost btn--sm" style={{ paddingLeft: 0 }}>
          <ArrowLeft size={16} />
          Volver a Proyectos
        </Link>
      </div>

      {/* Main Header */}
      <div className="page-header">
        <div className="page-header__text">
          <div className="row" style={{ gap: '10px' }}>
            <span className="badge badge--solid mono">{project.tokenSymbol || 'TKN'}</span>
            <span className="badge badge--strong">Contrato Fiduciario ID: FID-{project.id.toUpperCase()}</span>
          </div>
          <h1>{project.name}</h1>
          <p className="row" style={{ gap: '6px', color: 'var(--color-text-muted)' }}>
            <MapPin size={16} />
            {project.location}
          </p>
        </div>
      </div>

      {/* Main Grid: Details vs Investment Action Card */}
      <div className="grid-2-1">
        {/* Left Column: Architectural and Financial Specs */}
        <div className="stack">
          {/* Progress and status */}
          <div className="card">
            <div className="card__header">
              <h2 className="card__title">Estado de Financiación y Ejecución</h2>
              <span className="badge badge--solid">{project.expectedApy}% APY Estimado</span>
            </div>
            <div className="card__body" style={{ display: 'grid', gap: 'var(--space-5)' }}>
              <div>
                <div className="row row--between" style={{ marginBottom: 'var(--space-2)' }}>
                  <span className="muted">Fondeo de Inversión Primaria</span>
                  <span className="num" style={{ fontWeight: 600 }}>
                    ${raisedUSD.toLocaleString()} / ${goalUSD.toLocaleString()} USD
                  </span>
                </div>
                <div className="progress">
                  <div className="progress__track" style={{ height: '8px' }}>
                    <div
                      className="progress__fill"
                      style={{ width: `${Math.min(project.fundedPercent, 100)}%` }}
                    />
                  </div>
                  <div className="progress__meta num">
                    <span>{project.fundedPercent}% completado</span>
                    <span>Plazo estimado: {project.durationMonths || 24} meses</span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 'var(--space-4)',
                  paddingTop: 'var(--space-4)',
                  borderTop: '1px solid var(--color-border)',
                }}
              >
                <div>
                  <span className="eyebrow">Avance Físico</span>
                  <div className="num" style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>
                    {project.progress}%
                  </div>
                  <span className="subtle" style={{ fontSize: 'var(--text-xs)' }}>
                    Verificado por perito
                  </span>
                </div>
                <div>
                  <span className="eyebrow">Instrumento</span>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                    Fideicomiso Inmobiliario
                  </div>
                  <span className="subtle" style={{ fontSize: 'var(--text-xs)' }}>
                    Derecho de cobro preferente
                  </span>
                </div>
                <div>
                  <span className="eyebrow">Red Blockchain</span>
                  <div className="num" style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                    EVM Testnet (ERC-20/3643)
                  </div>
                  <span className="subtle" style={{ fontSize: 'var(--text-xs)' }}>
                    Transferencias restringidas
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Specs */}
          <div className="card">
            <div className="card__header">
              <h2 className="card__title">Memoria del Proyecto & Especificaciones</h2>
            </div>
            <div className="card__body" style={{ display: 'grid', gap: 'var(--space-4)' }}>
              <p className="muted" style={{ lineHeight: 1.7 }}>
                {project.description}
              </p>

              <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                <span className="eyebrow">Hitos de Construcción y Auditoría Técnica</span>
                <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                  <div className="row" style={{ gap: '12px' }}>
                    <CheckCircle2 size={18} style={{ color: 'var(--gray-300)' }} />
                    <div style={{ display: 'grid' }}>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                        Movimiento de suelos y cimentaciones profundas
                      </span>
                      <span className="subtle" style={{ fontSize: 'var(--text-xs)' }}>
                        Completado y validado en informe de ingeniería.
                      </span>
                    </div>
                  </div>
                  <div className="row" style={{ gap: '12px' }}>
                    <CheckCircle2 size={18} style={{ color: 'var(--gray-300)' }} />
                    <div style={{ display: 'grid' }}>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                        Estructura de hormigón armado hasta piso 8
                      </span>
                      <span className="subtle" style={{ fontSize: 'var(--text-xs)' }}>
                        Ensayos de probetas aprobados.
                      </span>
                    </div>
                  </div>
                  <div className="row" style={{ gap: '12px' }}>
                    <Clock size={18} style={{ color: 'var(--gray-600)' }} />
                    <div style={{ display: 'grid' }}>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-muted)' }}>
                        Mampostería, instalaciones sanitarias y aberturas
                      </span>
                      <span className="subtle" style={{ fontSize: 'var(--text-xs)' }}>
                        Planificado para el siguiente tramo de desembolso.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Investment Simulation Ticket */}
        <div className="stack">
          <div className="card" style={{ border: '1px solid var(--gray-700)' }}>
            <div className="card__header">
              <div className="row">
                <Coins size={18} className="muted" />
                <h2 className="card__title">Simulador de Inversión</h2>
              </div>
              <span className="badge badge--dashed">Demo Académica</span>
            </div>

            <div className="card__body">
              {simulationSuccess ? (
                <div style={{ display: 'grid', gap: 'var(--space-4)', textAlign: 'center' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'var(--gray-800)',
                      border: '1px solid var(--gray-600)',
                      display: 'grid',
                      placeItems: 'center',
                      margin: '0 auto',
                    }}
                  >
                    <CheckCircle2 size={24} />
                  </div>
                  <div style={{ display: 'grid', gap: '4px' }}>
                    <h3 style={{ fontSize: 'var(--text-md)' }}>Inversión Simulada Registrada</h3>
                    <p className="muted" style={{ fontSize: 'var(--text-xs)' }}>
                      Asiento registrado en el Ledger contable y token emitido en testnet.
                    </p>
                  </div>

                  <div
                    style={{
                      background: 'var(--color-surface-raised)',
                      padding: 'var(--space-3)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-xs)',
                      display: 'grid',
                      gap: '8px',
                      textAlign: 'left',
                    }}
                  >
                    <div className="row row--between">
                      <span className="subtle">Tokens Asignados</span>
                      <strong className="mono">{simulationSuccess.tokens} {project.tokenSymbol}</strong>
                    </div>
                    <div className="row row--between">
                      <span className="subtle">Monto Invertido</span>
                      <strong className="num">${simulationSuccess.amount.toLocaleString()} USD</strong>
                    </div>
                    <div className="row row--between">
                      <span className="subtle">Tx Hash (EVM)</span>
                      <span className="mono subtle">{simulationSuccess.txHash}</span>
                    </div>
                  </div>

                  <div className="row" style={{ gap: '8px' }}>
                    <Link to="/app/portfolio" className="btn btn--primary btn--block">
                      Ver en Mi Portfolio
                    </Link>
                    <button
                      className="btn btn--secondary btn--block"
                      onClick={() => setSimulationSuccess(null)}
                    >
                      Otra Simulación
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSimulateInvestment} style={{ display: 'grid', gap: 'var(--space-4)' }}>
                  <div className="field">
                    <label className="field__label">Monto a Simular (USD)</label>
                    <input
                      type="number"
                      className="input num"
                      min={project.minInvestment || 500}
                      step="100"
                      value={investAmount}
                      onChange={(e) => setInvestAmount(Number(e.target.value))}
                    />
                    <div className="row row--between" style={{ fontSize: '11px', color: 'var(--color-text-subtle)' }}>
                      <span>Mínimo: ${project.minInvestment || 500} USD</span>
                      <span>Valor token: $100 USD</span>
                    </div>
                  </div>

                  {/* Quick amount selector */}
                  <div className="row" style={{ gap: '6px' }}>
                    {[500, 1000, 2500, 5000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        className="btn btn--ghost btn--sm num"
                        style={{ flex: 1, border: '1px solid var(--color-border)' }}
                        onClick={() => setInvestAmount(amt)}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>

                  {/* Calculations */}
                  <div
                    style={{
                      background: 'var(--color-surface-raised)',
                      padding: 'var(--space-4)',
                      borderRadius: 'var(--radius-md)',
                      display: 'grid',
                      gap: 'var(--space-2)',
                      fontSize: 'var(--text-xs)',
                    }}
                  >
                    <div className="row row--between">
                      <span className="muted">Participaciones equivalentes:</span>
                      <strong className="mono">{tokensToReceive} {project.tokenSymbol || 'TKN'}</strong>
                    </div>
                    <div className="row row--between">
                      <span className="muted">Renta trimestral esperada:</span>
                      <strong className="num">${quarterlyYield} USD</strong>
                    </div>
                    <div className="row row--between">
                      <span className="muted">Rentabilidad anual neta:</span>
                      <strong className="num">{project.expectedApy}% APY</strong>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn--primary btn--lg"
                    disabled={isSimulating || investAmount < (project.minInvestment || 500)}
                  >
                    {isSimulating ? 'Confirmando en Ledger...' : 'Ejecutar Inversión Simulada'}
                  </button>

                  <p className="subtle" style={{ fontSize: '11px', textAlign: 'center', lineHeight: 1.4 }}>
                    Operación sin desembolso real. Utiliza la lógica de idempotencia y outbox transaccional
                    prevista en la arquitectura del backend.
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Legal Instrument Card */}
          <div className="card">
            <div className="card__header">
              <div className="row">
                <FileText size={16} className="muted" />
                <h3 className="card__title" style={{ fontSize: 'var(--text-sm)' }}>Estructura Jurídica</h3>
              </div>
            </div>
            <div className="card__body" style={{ fontSize: 'var(--text-xs)', display: 'grid', gap: '8px' }}>
              <p className="muted">
                El token digital no constituye por sí mismo la propiedad física del inmueble. Está
                vinculado a un contrato de fideicomiso financiero o cesión de derechos económicos con la
                desarrolladora bajo ley argentina.
              </p>
              <div className="row row--between" style={{ paddingTop: '8px', borderTop: '1px solid var(--color-border)' }}>
                <span className="subtle mono">Dictamen Legal Simulado #491</span>
                <span className="badge badge--strong">Aprobado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
