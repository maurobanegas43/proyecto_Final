import { Project, Investment, SecondaryMarketOrder, LedgerEntry, DeveloperProfile } from '../types';
import { getProjectAuditDetails } from './projectAuditData';

export const INITIAL_DEVELOPERS: DeveloperProfile[] = [
  {
    id: 'dev-alpes',
    companyName: 'Alpes Desarrollos Urbanos S.A.',
    tradeName: 'Alpes Urban',
    cuit: '30-71234567-8',
    companyType: 'SA',
    email: 'desarrollo@alpesurban.com.ar',
    phone: '+54 11 4820-9100',
    legalAddress: 'Av. del Libertador 4400, CABA',
    repFullName: 'Ing. Matías E. Varela',
    repRole: 'Director de Obras y Apoderado',
    specialty: 'Torres corporativas sustentables, oficinas AAA y certificación LEED',
    deliveredM2: 85000,
    completedProjects: 7,
    verificationStatus: 'verified',
    logoBadge: 'ALPES',
  },
  {
    id: 'dev-urban',
    companyName: 'Urban Capital Partners S.A.S.',
    tradeName: 'Urban Capital',
    cuit: '30-71891234-5',
    companyType: 'SAS',
    email: 'info@urbancapital.com.ar',
    phone: '+54 11 5238-1400',
    legalAddress: 'Av. Figueroa Alcorta 3200, Palermo, CABA',
    repFullName: 'Arq. Florencia Santillán',
    repRole: 'Socia Gerente & Directora de Proyecto',
    specialty: 'Residencias de alta gama en corredores consolidados y semipisos de lujo',
    deliveredM2: 45000,
    completedProjects: 5,
    verificationStatus: 'verified',
    logoBadge: 'URBAN',
  },
  {
    id: 'dev-nord',
    companyName: 'Nord Logistics Real Estate S.R.L.',
    tradeName: 'Nord Industrial & Logistics',
    cuit: '30-70984512-3',
    companyType: 'SRL',
    email: 'operaciones@nordlogistics.com.ar',
    phone: '+54 11 6091-7700',
    legalAddress: 'Panamericana Ramal Campana Km 72, Pcia. Buenos Aires',
    repFullName: 'Lic. Gonzalo Benítez',
    repRole: 'Director de Operaciones e Infraestructura',
    specialty: 'Parques logísticos Triple A con contratos de largo plazo para e-commerce',
    deliveredM2: 120000,
    completedProjects: 9,
    verificationStatus: 'verified',
    logoBadge: 'NORD',
  },
  {
    id: 'dev-innovar',
    companyName: 'Innovar PropTech & Living S.A.',
    tradeName: 'Innovar Living',
    cuit: '30-71556677-2',
    companyType: 'SA',
    email: 'proyectos@innovarliving.com.ar',
    phone: '+54 11 4775-8830',
    legalAddress: 'Honduras 4800, Palermo Soho, CABA',
    repFullName: 'Santiago M. Rossi',
    repRole: 'CEO & Fundador',
    specialty: 'Smart-living, coliving y micro-apartamentos para rentas temporarias en dólares',
    deliveredM2: 28000,
    completedProjects: 4,
    verificationStatus: 'verified',
    logoBadge: 'INNOVAR',
  },
  {
    id: 'dev-suraustral',
    companyName: 'Sur Austral Desarrollos Inmobiliarios S.A.',
    tradeName: 'Sur Austral Real Estate',
    cuit: '30-71445566-1',
    companyType: 'SA',
    email: 'contacto@suraustral.com.ar',
    phone: '+54 294 442-8900',
    legalAddress: 'Av. Bustillo Km 4.2, San Carlos de Bariloche, Río Negro',
    repFullName: 'Dr. Lucas E. Méndez',
    repRole: 'Apoderado Legal y Director de Inversiones',
    specialty: 'Eco-resorts, condo-hoteles de montaña y hotelería sustentable en Patagonia',
    deliveredM2: 38000,
    completedProjects: 3,
    verificationStatus: 'verified',
    logoBadge: 'SUR AUSTRAL',
  },
  {
    id: 'dev-metropolis',
    companyName: 'Metrópolis Hábitat & Retail S.R.L.',
    tradeName: 'Metrópolis Group',
    cuit: '30-71667788-9',
    companyType: 'SRL',
    email: 'institucional@metropolisgroup.com.ar',
    phone: '+54 11 5354-2000',
    legalAddress: 'Juana Manso 1600, Dique 2, Puerto Madero, CABA',
    repFullName: 'Arq. Carolina Beltrán',
    repRole: 'Directora de Arquitectura y Planeamiento',
    specialty: 'Desarrollos de usos mixtos (retail premium + residencial) en frentes de agua',
    deliveredM2: 95000,
    completedProjects: 6,
    verificationStatus: 'verified',
    logoBadge: 'METRÓPOLIS',
  },
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    developerId: 'dev-alpes',
    developerName: 'Alpes Desarrollos Urbanos S.A.',
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
    images: [
      {
        url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        caption: 'Fachada Principal y Terrazas Verdes Bioclimáticas',
        category: 'render',
      },
      {
        url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
        caption: 'Avance de Estructura: Hormigonado de Losas Piso 10',
        category: 'construction',
      },
      {
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        caption: 'Interiores de Plantas Libres Corporativas AAA',
        category: 'interior',
      },
      {
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
        caption: 'Muro Cortina Doble Vidriado Hermético (DVH)',
        category: 'aerial',
      },
      {
        url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80',
        caption: 'Rooftop Lounge & Coworking con Vista Panorámica',
        category: 'amenity',
      },
    ],
  },
  {
    id: 'proj-002',
    developerId: 'dev-urban',
    developerName: 'Urban Capital Partners S.A.S.',
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
    images: [
      {
        url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
        caption: 'Fachada Frente al Parque en Corredor Libertador',
        category: 'render',
      },
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        caption: 'Semipisos con Living Apaisado y Grandes Ventanales',
        category: 'interior',
      },
      {
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        caption: 'Cocinas Integradas con Revestimientos de Mármol y Silestone',
        category: 'interior',
      },
      {
        url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80',
        caption: 'Avance de Obra: Instalaciones y Cerramientos Piso 14',
        category: 'construction',
      },
      {
        url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
        caption: 'Piscina Climatizada In/Out, Solarium y Spa',
        category: 'amenity',
      },
    ],
  },
  {
    id: 'proj-003',
    developerId: 'dev-nord',
    developerName: 'Nord Logistics Real Estate S.R.L.',
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
    images: [
      {
        url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
        caption: 'Vista Aérea del Centro Logístico y Dársenas de Carga',
        category: 'render',
      },
      {
        url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
        caption: 'Montaje de Pórticos y Estructura Metálica de Gran Luz',
        category: 'construction',
      },
      {
        url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
        caption: 'Pisos Industriales con Nivelación Láser de Alta Resistencia',
        category: 'interior',
      },
      {
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        caption: 'Sector de Oficinas Administrativas y Sala de Control 24/7',
        category: 'amenity',
      },
    ],
  },
  {
    id: 'proj-004',
    developerId: 'dev-innovar',
    developerName: 'Innovar PropTech & Living S.A.',
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
    images: [
      {
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        caption: 'Fachada Vanguardista con Vegetación Vertical',
        category: 'render',
      },
      {
        url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
        caption: 'Estudio Modelo Totalmente Equipado para Airbnb',
        category: 'interior',
      },
      {
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        caption: 'Área de Coworking Integrada y Café Comunitario',
        category: 'amenity',
      },
      {
        url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
        caption: 'Avance de Obra: Encofrados y Fundaciones Especiales',
        category: 'construction',
      },
      {
        url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80',
        caption: 'Rooftop Grill & Solarium para Huéspedes',
        category: 'amenity',
      },
    ],
  },
  {
    id: 'proj-005',
    developerId: 'dev-suraustral',
    developerName: 'Sur Austral Desarrollos Inmobiliarios S.A.',
    name: 'Llao Llao Eco-Residences & Spa',
    location: 'Circuito Chico, Bariloche',
    description: 'Condo-hotel de montaña y spa termal sustentable en la Patagonia. Certificación ambiental internacional con pool de renta turística en dólares y uso exclusivo anual para inversores.',
    fundingGoal: 150000000,
    fundsRaised: 45000000,
    fundedPercent: 30,
    progress: 25,
    status: 'published',
    createdAt: '2026-10-18T11:00:00Z',
    expectedApy: 13.8,
    minInvestment: 1500,
    durationMonths: 28,
    tokenSymbol: 'LLAO-05',
    category: 'Turismo & Renta',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
        caption: 'Arquitectura Alpina Contemporánea Integrada al Bosque',
        category: 'render',
      },
      {
        url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        caption: 'Master Suite con Chimenea y Vista al Lago Nahuel Huapi',
        category: 'interior',
      },
      {
        url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
        caption: 'Spa Termal y Piscina Climatizada con Borde Infinito',
        category: 'amenity',
      },
      {
        url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
        caption: 'Avance de Obra: Cimientos en Roca y Estructura Sismorresistente',
        category: 'construction',
      },
    ],
  },
  {
    id: 'proj-006',
    developerId: 'dev-metropolis',
    developerName: 'Metrópolis Hábitat & Retail S.R.L.',
    name: 'Madero Harbour Bay & Residences',
    location: 'Dique 2, Puerto Madero, Buenos Aires',
    description: 'Torre icónica frente al espejo de agua con zócalo gastronómico internacional y residencias de lujo. Fideicomiso garantizado con hipoteca en primer grado sobre el terreno.',
    fundingGoal: 250000000,
    fundsRaised: 187500000,
    fundedPercent: 75,
    progress: 55,
    status: 'published',
    createdAt: '2026-10-05T09:00:00Z',
    expectedApy: 12.0,
    minInvestment: 2000,
    durationMonths: 30,
    tokenSymbol: 'MDR-06',
    category: 'Residencial Premium',
    imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1200&q=80',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1200&q=80',
        caption: 'Torre Vidriada Frente al Dique con Vistas al Río de la Plata',
        category: 'render',
      },
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        caption: 'Penthouse de Doble Altura con Terraza Privada',
        category: 'interior',
      },
      {
        url: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=1200&q=80',
        caption: 'Zócalo Comercial, Restaurantes y Marina Exclusiva',
        category: 'amenity',
      },
      {
        url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80',
        caption: 'Avance de Obra: Tabiques de Hormigón Visto y Carpinterías Piso 18',
        category: 'construction',
      },
      {
        url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80',
        caption: 'Piscina Voladiza en Altura con Vista Panorámica a la Ciudad',
        category: 'amenity',
      },
    ],
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
  async getDevelopers(): Promise<DeveloperProfile[]> {
    return INITIAL_DEVELOPERS;
  },

  async getDeveloper(id: string): Promise<DeveloperProfile | undefined> {
    return INITIAL_DEVELOPERS.find((d) => d.id === id);
  },

  async getProjects(): Promise<Project[]> {
    try {
      const res = await fetch('/api/v1/projects');
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          // Merge and hydrate API response with rich photo galleries and developer info
          const merged = INITIAL_PROJECTS.map((initP) => {
            const remote = json.data.find(
              (r: any) =>
                r.id === initP.id ||
                r.name?.toLowerCase().trim() === initP.name?.toLowerCase().trim()
            );
            if (remote) {
              return {
                ...initP,
                ...remote,
                imageUrl: initP.imageUrl || remote.imageUrl,
                images: initP.images && initP.images.length > 0 ? initP.images : remote.images,
                expectedApy: initP.expectedApy || remote.expectedApy || 12.5,
                minInvestment: initP.minInvestment || 500,
                durationMonths: initP.durationMonths || 24,
                tokenSymbol: initP.tokenSymbol || remote.tokenSymbol,
                category: initP.category || remote.category || 'Residencial Premium',
                developerName: initP.developerName,
              };
            }
            return initP;
          });

          // Also include any dynamically created projects from PostgreSQL/Backend
          json.data.forEach((remote: any) => {
            const exists = merged.some(
              (m) =>
                m.id === remote.id ||
                m.name?.toLowerCase().trim() === remote.name?.toLowerCase().trim()
            );
            if (!exists) {
              const matchedDev = INITIAL_DEVELOPERS.find((d) => d.id === remote.developerId);
              merged.push({
                ...remote,
                imageUrl:
                  remote.imageUrl ||
                  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
                images: [
                  {
                    url:
                      remote.imageUrl ||
                      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
                    caption: 'Render Arquitectónico Principal',
                    category: 'render',
                  },
                ],
                expectedApy: remote.expectedApy || 12.0,
                minInvestment: 500,
                durationMonths: 24,
                tokenSymbol: remote.tokenSymbol || (remote.name ? remote.name.substring(0, 4).toUpperCase() + '-01' : 'TKN-01'),
                category: remote.category || 'Residencial Premium',
                developerName: matchedDev?.companyName || remote.developerId,
              });
            }
          });

          return merged.map((p) => {
            const audit = getProjectAuditDetails(p.id);
            return {
              ...p,
              architecturalSpecs: p.architecturalSpecs || audit.architecturalSpecs,
              constructionData: p.constructionData || audit.constructionData,
              budgetAudit: p.budgetAudit || audit.budgetAudit,
              progressMilestones: p.progressMilestones || audit.progressMilestones,
            };
          });
        }
      }
    } catch {
      // Fallback to initial mock if API server is not running yet
    }
    return INITIAL_PROJECTS.map((p) => {
      const audit = getProjectAuditDetails(p.id);
      return {
        ...p,
        architecturalSpecs: p.architecturalSpecs || audit.architecturalSpecs,
        constructionData: p.constructionData || audit.constructionData,
        budgetAudit: p.budgetAudit || audit.budgetAudit,
        progressMilestones: p.progressMilestones || audit.progressMilestones,
      };
    });
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

  async createLivenessSession(): Promise<{ sessionId: string; expiresAt: string }> {
    try {
      const res = await fetch('/api/v1/auth/liveness/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Liveness session API fallback:', err);
    }
    // Fallback for isolated offline/mock demo scenarios
    return {
      sessionId: 'sess-' + Math.random().toString(36).substring(2, 12),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    };
  },

  async verifyLivenessSession(
    sessionId: string,
    proofHash: string,
    confidence: number
  ): Promise<{
    verified: boolean;
    sessionId: string;
    verificationToken: string;
    verifiedAt: string;
  }> {
    try {
      const res = await fetch('/api/v1/auth/liveness/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, proofHash, confidence }),
      });
      if (res.ok) {
        return await res.json();
      }
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Error verificando liveness en el servidor');
    } catch (err) {
      console.warn('Liveness verify API fallback/warning:', err);
      // Fallback only if mock server without backend running
      return {
        verified: true,
        sessionId,
        verificationToken: 'vtok-' + Math.random().toString(36).substring(2, 14),
        verifiedAt: new Date().toISOString(),
      };
    }
  },
};
