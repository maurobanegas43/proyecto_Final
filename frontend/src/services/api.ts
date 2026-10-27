import { Project, Investment, SecondaryMarketOrder, LedgerEntry } from '../types';

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    developerId: 'dev-alpes',
    name: 'Torre Krea Nova I',
    location: 'Distrito Tecnológico, Buenos Aires',
    description: 'Torre corporativa y de micro-living sustentable con certificación LEED Gold. Rentas corporativas en dólares respaldadas por empresas de tecnología de primera línea.',
    fundingGoal: 75000000, // $750,000.00
    fundsRaised: 52500000,  // $525,000.00
    fundedPercent: 70,
    progress: 42,
    status: 'published',
    createdAt: '2026-08-15T10:00:00Z',
    expectedApy: 11.5,
    minInvestment: 500,
    durationMonths: 24,
    tokenSymbol: 'KN-01',
    category: 'Corporativo & Renta',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'proj-002',
    developerId: 'dev-urban',
    name: 'Residencias Libertador',
    location: 'Núñez, Buenos Aires',
    description: 'Complejo residencial exclusivo frente al parque en el corredor más cotizado de la ciudad. Fideicomiso al costo con alta plusvalía estimada al pozo.',
    fundingGoal: 120000000,
    fundsRaised: 98400000,
    fundedPercent: 82,
    progress: 68,
    status: 'published',
    createdAt: '2026-09-01T14:30:00Z',
    expectedApy: 13.0,
    minInvestment: 1000,
    durationMonths: 18,
    tokenSymbol: 'RLIB-02',
    category: 'Residencial Premium',
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'proj-003',
    developerId: 'dev-nord',
    name: 'Parque Logístico Ruta 9',
    location: 'Campana, Buenos Aires',
    description: 'Naves industriales Triple A con contratos de alquiler a 10 años ya pre-acordados con líderes de e-commerce. Flujo de caja recurrente y cobro trimestral en USD.',
    fundingGoal: 200000000,
    fundsRaised: 60000000,
    fundedPercent: 30,
    progress: 15,
    status: 'published',
    createdAt: '2026-09-20T09:15:00Z',
    expectedApy: 14.2,
    minInvestment: 2500,
    durationMonths: 36,
    tokenSymbol: 'PLOG-03',
    category: 'Logística & Rentas',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'proj-004',
    developerId: 'dev-innovar',
    name: 'Coliving & Studios Palermo',
    location: 'Palermo Soho, Buenos Aires',
    description: 'Edificio boutique de estudios amoblados para alquiler temporal y nómadas digitales. Máxima ocupación turística con distribución periódica de utilidades.',
    fundingGoal: 50000000,
    fundsRaised: 0,
    fundedPercent: 0,
    progress: 5,
    status: 'published',
    createdAt: '2026-10-12T16:00:00Z',
    expectedApy: 12.5,
    minInvestment: 500,
    durationMonths: 14,
    tokenSymbol: 'CLV-04',
    category: 'Turismo & Renta',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  },
];

const INITIAL_INVESTMENTS: Investment[] = [
  {
    id: 'inv-101',
    projectId: 'proj-001',
    projectName: 'Torre Krea Nova I',
    amount: 5000,
    tokens: 50,
    date: '2026-09-10',
    status: 'active',
    simulatedTxHash: '0x8f2d...3a9c',
  },
  {
    id: 'inv-102',
    projectId: 'proj-002',
    projectName: 'Residencias Libertador',
    amount: 10000,
    tokens: 100,
    date: '2026-09-25',
    status: 'active',
    simulatedTxHash: '0x3e1b...77e4',
  },
];

const INITIAL_ORDERS: SecondaryMarketOrder[] = [
  {
    id: 'ord-01',
    projectId: 'proj-001',
    projectName: 'Torre Krea Nova I',
    tokenSymbol: 'KN-01',
    type: 'sell',
    amountTokens: 25,
    pricePerToken: 104.5,
    totalValue: 2612.5,
    sellerOrBuyerId: 'usr-889',
    status: 'open',
    createdAt: '2026-10-24T12:00:00Z',
  },
  {
    id: 'ord-02',
    projectId: 'proj-002',
    projectName: 'Residencias Libertador',
    tokenSymbol: 'RLIB-02',
    type: 'buy',
    amountTokens: 40,
    pricePerToken: 99.0,
    totalValue: 3960.0,
    sellerOrBuyerId: 'usr-210',
    status: 'open',
    createdAt: '2026-10-25T08:30:00Z',
  },
  {
    id: 'ord-03',
    projectId: 'proj-001',
    projectName: 'Torre Krea Nova I',
    tokenSymbol: 'KN-01',
    type: 'buy',
    amountTokens: 10,
    pricePerToken: 102.0,
    totalValue: 1020.0,
    sellerOrBuyerId: 'usr-441',
    status: 'open',
    createdAt: '2026-10-26T15:10:00Z',
  },
];

const INITIAL_LEDGER: LedgerEntry[] = [
  {
    id: 'tx-501',
    timestamp: '2026-10-26 14:20:00',
    type: 'yield',
    description: 'Distribución de renta trimestral - RLIB-02',
    amount: 325.0,
    balanceAfter: 15325.0,
    referenceId: 'REF-DIST-901',
  },
  {
    id: 'tx-500',
    timestamp: '2026-09-25 11:05:00',
    type: 'investment',
    description: 'Suscripción primaria - Residencias Libertador (100 RLIB-02)',
    amount: -10000.0,
    balanceAfter: 15000.0,
    referenceId: 'REF-SUB-442',
  },
  {
    id: 'tx-499',
    timestamp: '2026-09-20 09:00:00',
    type: 'deposit',
    description: 'Acreditación de fondos simulada (Fiduciaria)',
    amount: 25000.0,
    balanceAfter: 25000.0,
    referenceId: 'REF-DEP-001',
  },
];

export const api = {
  async getProjects(): Promise<Project[]> {
    try {
      const res = await fetch('/api/v1/projects');
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          return json.data;
        }
      }
    } catch {
      // Fallback to initial mock if API server is not running yet
    }
    return INITIAL_PROJECTS;
  },

  async getProject(id: string): Promise<Project | undefined> {
    const list = await this.getProjects();
    return list.find((p) => p.id === id);
  },

  async createProject(data: Partial<Project>): Promise<Project> {
    const newProj: Project = {
      id: `proj-${Date.now().toString(36)}`,
      developerId: 'dev-current',
      name: data.name || 'Proyecto Sin Nombre',
      location: data.location || 'Argentina',
      description: data.description || '',
      fundingGoal: (data.fundingGoal || 100000) * 100,
      fundsRaised: 0,
      fundedPercent: 0,
      progress: 0,
      status: 'draft',
      createdAt: new Date().toISOString(),
      expectedApy: data.expectedApy || 12,
      minInvestment: data.minInvestment || 500,
      durationMonths: data.durationMonths || 24,
      tokenSymbol: data.name ? data.name.substring(0, 4).toUpperCase() + '-01' : 'TKN-01',
    };
    INITIAL_PROJECTS.unshift(newProj);
    return newProj;
  },

  async getInvestments(): Promise<Investment[]> {
    return INITIAL_INVESTMENTS;
  },

  async simulateInvestment(projectId: string, amountUSD: number): Promise<Investment> {
    const proj = await this.getProject(projectId);
    const tokens = Math.floor(amountUSD / 100);
    const inv: Investment = {
      id: `inv-${Date.now().toString(36)}`,
      projectId,
      projectName: proj?.name || 'Proyecto Inmobiliario',
      amount: amountUSD,
      tokens,
      date: new Date().toISOString().split('T')[0],
      status: 'active',
      simulatedTxHash: '0x' + Array.from({ length: 4 }, () => Math.floor(Math.random() * 65536).toString(16).padStart(4, '0')).join(''),
    };
    INITIAL_INVESTMENTS.unshift(inv);
    INITIAL_LEDGER.unshift({
      id: `tx-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      type: 'investment',
      description: `Inversión primaria en ${inv.projectName} (${tokens} tokens)`,
      amount: -amountUSD,
      balanceAfter: 15325.0 - amountUSD,
      referenceId: inv.simulatedTxHash,
    });
    return inv;
  },

  async getMarketOrders(): Promise<SecondaryMarketOrder[]> {
    return INITIAL_ORDERS;
  },

  async createOrder(order: Omit<SecondaryMarketOrder, 'id' | 'createdAt' | 'status' | 'totalValue'>): Promise<SecondaryMarketOrder> {
    const newOrder: SecondaryMarketOrder = {
      ...order,
      id: `ord-${Date.now().toString(36)}`,
      status: 'open',
      totalValue: order.amountTokens * order.pricePerToken,
      createdAt: new Date().toISOString(),
    };
    INITIAL_ORDERS.unshift(newOrder);
    return newOrder;
  },

  async getLedger(): Promise<LedgerEntry[]> {
    return INITIAL_LEDGER;
  },
};
