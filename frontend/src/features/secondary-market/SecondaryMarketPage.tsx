import React, { useEffect, useState } from 'react';
import { Repeat, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { api } from '../../services/api';
import { SecondaryMarketOrder } from '../../types';

export const SecondaryMarketPage: React.FC = () => {
  const [orders, setOrders] = useState<SecondaryMarketOrder[]>([]);
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [amountTokens, setAmountTokens] = useState<number>(10);
  const [pricePerToken, setPricePerToken] = useState<number>(102.5);
  const [selectedAsset, setSelectedAsset] = useState<string>('BST-01');

  useEffect(() => {
    api.getMarketOrders().then(setOrders);
  }, []);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amountTokens <= 0 || pricePerToken <= 0) return;

    const newOrder = await api.createOrder({
      projectId: selectedAsset === 'KN-01' ? 'proj-001' : 'proj-002',
      projectName: selectedAsset === 'KN-01' ? 'Torre Krea Nova I' : 'Residencias Libertador',
      tokenSymbol: selectedAsset,
      type: orderType,
      amountTokens,
      pricePerToken,
      sellerOrBuyerId: 'usr-current',
    });

    setOrders([newOrder, ...orders]);
  };

  const sellOrders = orders.filter((o) => o.type === 'sell' && o.status === 'open');
  const buyOrders = orders.filter((o) => o.type === 'buy' && o.status === 'open');

  return (
    <div className="stack">
      {/* Header */}
      <div className="page-header">
        <div className="page-header__text">
          <span className="eyebrow">Liquidez Secundaria</span>
          <h1>Mercado Secundario de Participaciones</h1>
          <p>
            Negociación entre inversores elegibles. El matching y gestión de órdenes opera off-chain
            en PostgreSQL; la transferencia de tokens se liquida en red EVM mediante contratos inteligentes con restricciones.
          </p>
        </div>
      </div>

      {/* Grid: Order Book & Form */}
      <div className="grid-2-1">
        {/* Order Book Column */}
        <div className="stack">
          {/* Sells (Ask) */}
          <div className="card">
            <div className="card__header">
              <div className="row">
                <ArrowDownRight size={18} className="muted" />
                <h2 className="card__title">Órdenes de Venta (Ask)</h2>
              </div>
              <span className="subtle" style={{ fontSize: 'var(--text-xs)' }}>
                {sellOrders.length} ofertas abiertas
              </span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Activo</th>
                    <th>Cantidad</th>
                    <th>Precio / Token</th>
                    <th className="right">Total (USD)</th>
                    <th className="right">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {sellOrders.map((ord) => (
                    <tr key={ord.id}>
                      <td>
                        <div style={{ display: 'grid' }}>
                          <span style={{ fontWeight: 600 }}>{ord.projectName}</span>
                          <span className="subtle mono" style={{ fontSize: '10px' }}>
                            {ord.tokenSymbol}
                          </span>
                        </div>
                      </td>
                      <td className="mono num">{ord.amountTokens} TKN</td>
                      <td className="num font-medium">${ord.pricePerToken.toFixed(2)}</td>
                      <td className="right num font-semibold">
                        ${ord.totalValue.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="right">
                        <button className="btn btn--secondary btn--sm">Comprar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Buys (Bid) */}
          <div className="card">
            <div className="card__header">
              <div className="row">
                <ArrowUpRight size={18} className="muted" />
                <h2 className="card__title">Órdenes de Compra (Bid)</h2>
              </div>
              <span className="subtle" style={{ fontSize: 'var(--text-xs)' }}>
                {buyOrders.length} demandas abiertas
              </span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Activo</th>
                    <th>Cantidad</th>
                    <th>Precio Ofrecido</th>
                    <th className="right">Total (USD)</th>
                    <th className="right">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {buyOrders.map((ord) => (
                    <tr key={ord.id}>
                      <td>
                        <div style={{ display: 'grid' }}>
                          <span style={{ fontWeight: 600 }}>{ord.projectName}</span>
                          <span className="subtle mono" style={{ fontSize: '10px' }}>
                            {ord.tokenSymbol}
                          </span>
                        </div>
                      </td>
                      <td className="mono num">{ord.amountTokens} TKN</td>
                      <td className="num font-medium">${ord.pricePerToken.toFixed(2)}</td>
                      <td className="right num font-semibold">
                        ${ord.totalValue.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="right">
                        <button className="btn btn--secondary btn--sm">Vender</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Place Order Form */}
        <div className="stack">
          <div className="card">
            <div className="card__header">
              <div className="row">
                <Repeat size={18} className="muted" />
                <h2 className="card__title">Nueva Orden de Mercado</h2>
              </div>
            </div>
            <form onSubmit={handleCreateOrder} className="card__body" style={{ display: 'grid', gap: 'var(--space-4)' }}>
              {/* Buy / Sell toggle */}
              <div className="segmented" style={{ width: '100%', display: 'flex' }}>
                <button
                  type="button"
                  className="segmented__item"
                  style={{ flex: 1 }}
                  aria-pressed={orderType === 'buy'}
                  onClick={() => setOrderType('buy')}
                >
                  Comprar Tokens
                </button>
                <button
                  type="button"
                  className="segmented__item"
                  style={{ flex: 1 }}
                  aria-pressed={orderType === 'sell'}
                  onClick={() => setOrderType('sell')}
                >
                  Vender Tokens
                </button>
              </div>

              <div className="field">
                <label className="field__label">Activo / Proyecto</label>
                <select
                  className="input"
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                >
                  <option value="KN-01">KN-01 — Torre Krea Nova I</option>
                  <option value="RLIB-02">RLIB-02 — Residencias Libertador</option>
                </select>
              </div>

              <div className="field">
                <label className="field__label">Cantidad de Participaciones (Tokens)</label>
                <input
                  type="number"
                  className="input num"
                  min="1"
                  value={amountTokens}
                  onChange={(e) => setAmountTokens(Number(e.target.value))}
                />
              </div>

              <div className="field">
                <label className="field__label">Precio Límite por Token (USD)</label>
                <input
                  type="number"
                  step="0.5"
                  className="input num"
                  min="1"
                  value={pricePerToken}
                  onChange={(e) => setPricePerToken(Number(e.target.value))}
                />
              </div>

              <div
                style={{
                  background: 'var(--color-surface-raised)',
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  display: 'grid',
                  gap: '6px',
                  fontSize: 'var(--text-xs)',
                }}
              >
                <div className="row row--between">
                  <span className="muted">Total Estimado de la Operación:</span>
                  <strong className="num" style={{ fontSize: 'var(--text-sm)' }}>
                    ${(amountTokens * pricePerToken).toLocaleString('es-AR', { minimumFractionDigits: 2 })} USD
                  </strong>
                </div>
                <div className="row row--between">
                  <span className="muted">Comisión de Liquidación (0% Demo):</span>
                  <span className="num">$0.00 USD</span>
                </div>
              </div>

              <button type="submit" className="btn btn--primary btn--lg">
                Publicar Orden en Libro
              </button>

              <div className="sandbox-note">
                <strong>Regla de Elegibilidad</strong>
                Solo inversores con KYC simulado aprobado pueden recibir participaciones vía smart contract.
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
