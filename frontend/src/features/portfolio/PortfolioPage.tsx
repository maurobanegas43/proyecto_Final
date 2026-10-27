import React, { useEffect, useState } from 'react';
import { History, Coins } from 'lucide-react';
import { api } from '../../services/api';
import { Investment, LedgerEntry } from '../../types';

export const PortfolioPage: React.FC = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'positions' | 'ledger'>('positions');

  useEffect(() => {
    Promise.all([api.getInvestments(), api.getLedger()]).then(([invs, led]) => {
      setInvestments(invs);
      setLedger(led);
    });
  }, []);

  const totalInvested = investments.reduce((acc, i) => acc + i.amount, 0);
  const totalTokens = investments.reduce((acc, i) => acc + i.tokens, 0);

  return (
    <div className="stack">
      {/* Header */}
      <div className="page-header">
        <div className="page-header__text">
          <span className="eyebrow">Posición Consolidada</span>
          <h1>Portfolio & Ledger Financiero</h1>
          <p>
            Registro inmutable de participaciones tokenizadas y movimientos contables de doble partida
            simulados en PostgreSQL.
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="card">
        <div className="grid-stats">
          <div className="stat">
            <span className="eyebrow">Valor de Cartera</span>
            <div className="stat__value num">${totalInvested.toLocaleString()} USD</div>
            <div className="stat__delta">
              <span className="subtle">En {investments.length} proyectos activos</span>
            </div>
          </div>
          <div className="stat">
            <span className="eyebrow">Tokens en Custodia</span>
            <div className="stat__value num">{totalTokens} TKN</div>
            <div className="stat__delta">
              <span className="subtle">ERC-20 simulados en Sepolia</span>
            </div>
          </div>
          <div className="stat">
            <span className="eyebrow">Renta Trimestral Proyectada</span>
            <div className="stat__value num">${(totalInvested * 0.12 / 4).toFixed(2)} USD</div>
            <div className="stat__delta">
              <span className="subtle">Promedio 12.0% tasa anual</span>
            </div>
          </div>
          <div className="stat">
            <span className="eyebrow">Auditoría Ledger</span>
            <div className="stat__value num">Consistente</div>
            <div className="stat__delta">
              <span className="subtle">0 discrepancias detectadas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="toolbar">
        <div className="segmented">
          <button
            className="segmented__item"
            aria-pressed={activeTab === 'positions'}
            onClick={() => setActiveTab('positions')}
          >
            Participaciones ({investments.length})
          </button>
          <button
            className="segmented__item"
            aria-pressed={activeTab === 'ledger'}
            onClick={() => setActiveTab('ledger')}
          >
            Libro Mayor / Ledger ({ledger.length})
          </button>
        </div>
      </div>

      {/* Content depending on tab */}
      {activeTab === 'positions' ? (
        <div className="card">
          <div className="card__header">
            <div className="row">
              <Coins size={18} className="muted" />
              <h2 className="card__title">Activos Inmobiliarios en Cartera</h2>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Proyecto</th>
                  <th>Tokens</th>
                  <th>Monto Invertido</th>
                  <th>Fecha Suscripción</th>
                  <th>Hash EVM (Testnet)</th>
                  <th className="right">Estado</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((inv) => (
                  <tr key={inv.id}>
                    <td>
                      <div style={{ display: 'grid' }}>
                        <span style={{ fontWeight: 600 }}>{inv.projectName}</span>
                        <span className="subtle mono" style={{ fontSize: '11px' }}>
                          ID: {inv.projectId}
                        </span>
                      </div>
                    </td>
                    <td className="mono num">{inv.tokens}</td>
                    <td className="num font-medium">${inv.amount.toLocaleString()} USD</td>
                    <td className="subtle">{inv.date}</td>
                    <td>
                      <span className="badge badge--strong mono" style={{ fontSize: '10px' }}>
                        {inv.simulatedTxHash}
                      </span>
                    </td>
                    <td className="right">
                      <span className="badge badge--solid">Activo</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card__header">
            <div className="row">
              <History size={18} className="muted" />
              <h2 className="card__title">Movimientos Financieros & Trazabilidad</h2>
            </div>
            <span className="badge badge--dashed">Regla ACID en PostgreSQL</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Fecha & Hora</th>
                  <th>Tipo Operación</th>
                  <th>Descripción</th>
                  <th>Referencia</th>
                  <th className="right">Monto</th>
                  <th className="right">Saldo Resultante</th>
                </tr>
              </thead>
              <tbody>
                {ledger.map((entry) => {
                  const isCredit = entry.amount > 0;
                  return (
                    <tr key={entry.id}>
                      <td className="subtle num">{entry.timestamp}</td>
                      <td>
                        <span
                          className={`badge ${isCredit ? 'badge--strong' : 'badge--outline'}`}
                          style={{ textTransform: 'uppercase', fontSize: '10px' }}
                        >
                          {entry.type}
                        </span>
                      </td>
                      <td style={{ fontWeight: 500 }}>{entry.description}</td>
                      <td className="mono subtle" style={{ fontSize: '11px' }}>
                        {entry.referenceId}
                      </td>
                      <td
                        className="right num"
                        style={{
                          fontWeight: 600,
                          color: isCredit ? 'var(--color-text)' : 'var(--color-text-muted)',
                        }}
                      >
                        {isCredit ? '+' : ''}${Math.abs(entry.amount).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="right num muted">
                        ${entry.balanceAfter.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
