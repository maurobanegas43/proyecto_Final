import { ArchitecturalSpecs, ConstructionData, ProjectBudgetAudit, ProgressMilestone } from '../types';

export function getProjectAuditDetails(projectId: string): {
  architecturalSpecs: ArchitecturalSpecs;
  constructionData: ConstructionData;
  budgetAudit: ProjectBudgetAudit;
  progressMilestones: ProgressMilestone[];
} {
  switch (projectId) {
    case 'proj-002':
      return {
        architecturalSpecs: {
          studioName: 'Dujovne-Hirsch & Associates',
          leadArchitect: 'Arq. Silvina Hirsch (Mat. CPAU 11.204)',
          structuralEngineer: 'Ing. Alberto Fainstein & Asoc.',
          landscapeDesign: 'Estudio Paisaje Urbano',
          designConcept:
            'Residencias de alta gama con semipisos pasantes frente al verde del parque. Doble orientación para ventilación cruzada y terrazas privadas con parrilla.',
          sustainabilityRating: 'Certificación EDGE Green Buildings',
          totalBuiltAreaM2: 18400,
          sellableAreaM2: 13900,
          floorsCount: 16,
          subfloorsCount: 3,
          totalUnitsCount: 42,
          amenitiesDescription:
            'Piscina semiolímpica climatizada in/out, microcine, cava privada individual para cada unidad, spa con sauna seco y húmedo.',
        },
        constructionData: {
          generalContractor: 'Riva S.A. Construcciones',
          technicalAuditor: 'TÜV Rheinland Argentina',
          permitNumber: 'PERM-OBRA-NU-7419/2025',
          workStartDate: '01 de Septiembre de 2025',
          estimatedDeliveryDate: '15 de Mayo de 2027',
          insurancePolicy: 'Sancor Seguros - Todo Riesgo Construcción #812903',
          fiduciaryTrustee: 'TMF Trust Company Argentina',
          notaryPublic: 'Escribanía Bunge & Asoc. (Registro 182 CABA)',
          currentWorkStatusSummary:
            'Estructura de hormigón al 100%. Mampostería exterior terminada. Se avanza con colocación de porcelanatos italianos y ductos de climatización VRV.',
        },
        budgetAudit: {
          totalBudgetUSD: 1200000,
          executedBudgetUSD: 816000,
          rubrosSummary: [
            { rubro: '1. Terreno, Demolición y Submuración', budgetedUSD: 180000, executedUSD: 180000, percentage: 100 },
            { rubro: '2. Estructura de Hormigón Armado', budgetedUSD: 360000, executedUSD: 360000, percentage: 100 },
            { rubro: '3. Mampostería, Revoques y Yesería', budgetedUSD: 150000, executedUSD: 120000, percentage: 80 },
            { rubro: '4. Instalaciones VRV, Sanitarias y Eléctricas', budgetedUSD: 210000, executedUSD: 110000, percentage: 52 },
            { rubro: '5. Carpinterías Aluar A40 DVH y Barandas', budgetedUSD: 160000, executedUSD: 36000, percentage: 22 },
            { rubro: '6. Terminaciones, Marmolería y Pintura', budgetedUSD: 80000, executedUSD: 0, percentage: 0 },
            { rubro: '7. Tasas, Dirección y Auditoría Externa', budgetedUSD: 60000, executedUSD: 10000, percentage: 16 },
          ],
          budgetItems: [
            { id: 'mat-201', category: 'material', concept: 'Hormigón H-35 con Aditivo Hidrófugo', details: 'Estructura sismorresistente', quantity: 1200, unit: 'm³', unitPriceUSD: 105, totalUSD: 126000, datePaid: '2026-02-15', recipientOrSupplier: 'Hormigonera del Plata', receiptNumber: 'FC-A-0002-8819' },
            { id: 'mat-202', category: 'material', concept: 'Hierro de Construcción Acindar ADN 420', details: 'Armaduras vigas y columnas', quantity: 72, unit: 'ton', unitPriceUSD: 1150, totalUSD: 82800, datePaid: '2026-03-10', recipientOrSupplier: 'Acindar S.A.', receiptNumber: 'FC-A-0019-3321' },
            { id: 'mat-203', category: 'material', concept: 'Pisos Porcelanato Calacatta Gold 120x120', details: 'Pisos semipisos nobles', quantity: 2400, unit: 'm²', unitPriceUSD: 38, totalUSD: 91200, datePaid: '2026-07-22', recipientOrSupplier: 'Ilva Porcellanato', receiptNumber: 'FC-A-0044-1290' },
            { id: 'mat-204', category: 'material', concept: 'Carpinterías de Aluminio Aluar A40 DVH', details: 'Aberturas acústicas de piso a techo', quantity: 180, unit: 'm²', unitPriceUSD: 240, totalUSD: 43200, datePaid: '2026-08-05', recipientOrSupplier: 'Aluminios del Sur', receiptNumber: 'FC-A-0008-7712' },
            { id: 'pay-201', category: 'payroll', concept: 'Oficiales Armadores y Encofradores', details: '18 operarios (quincenas acumuladas)', totalUSD: 64500, datePaid: '2026-08-15', recipientOrSupplier: 'CCT UOCRA 76/75', receiptNumber: 'REC-HAB-09-2026' },
            { id: 'pay-202', category: 'payroll', concept: 'Oficiales Yeseros y Albañilería Fina', details: '12 operarios (revoques y enlucidos)', totalUSD: 39800, datePaid: '2026-08-15', recipientOrSupplier: 'CCT UOCRA 76/75', receiptNumber: 'REC-HAB-10-2026' },
            { id: 'pay-203', category: 'payroll', concept: 'Cargas Sociales AFIP F.931 y ART', details: 'Aportes jubilatorios y riesgos de trabajo', totalUSD: 41200, datePaid: '2026-08-20', recipientOrSupplier: 'AFIP / Provincia ART', receiptNumber: 'VEP-992144-AFIP' },
            { id: 'eq-201', category: 'equipment', concept: 'Grúa Torre Liebherr 50m y Montacargas', details: 'Alquiler y mantenimiento preventivo', totalUSD: 32000, datePaid: '2026-07-30', recipientOrSupplier: 'Liebherr Rental', receiptNumber: 'FC-A-0091-2210' },
          ],
        },
        progressMilestones: [
          { id: 'm-201', date: '15/10/2025', title: 'Excavación de 3 subsuelos y muros colados', phase: 'Fundaciones', percentage: 100, inspector: 'Ing. M. Benítez (TÜV)', status: 'completed', reportSummary: 'Ensayo de anclajes conforme a normativa.', technicalDetails: 'Submuración ejecutada sin desvíos perimetrales.' },
          { id: 'm-202', date: '20/02/2026', title: 'Hormigonado de Planta Baja y Entrepiso', phase: 'Estructura', percentage: 100, inspector: 'Ing. M. Benítez (TÜV)', status: 'completed', reportSummary: 'Resistencia probetas supera H-35.', technicalDetails: 'Curado continuo con membrana química.' },
          { id: 'm-203', date: '10/06/2026', title: 'Culminación de Losa Piso 16 (Topping Out)', phase: 'Estructura', percentage: 100, inspector: 'Ing. M. Benítez (TÜV)', status: 'completed', reportSummary: 'Estructura principal finalizada.', technicalDetails: 'Tolerancias dimensionales dentro de norma DIN 18202.' },
          { id: 'm-204', date: '15/09/2026', title: 'Avance en Yesería y Tendido de Instalaciones', phase: 'Instalaciones', percentage: 68, inspector: 'Ing. M. Benítez (TÜV)', status: 'in_progress', reportSummary: 'Instalación de cañerías PEX y cableado antiflama.', technicalDetails: 'Pruebas hidráulicas a 10 bar aprobadas sin pérdidas.' },
          { id: 'm-205', date: '15/01/2027', title: 'Terminaciones finas y equipamiento de Amenities', phase: 'Acabados', percentage: 0, inspector: 'Ing. M. Benítez (TÜV)', status: 'upcoming', reportSummary: 'Colocación de sanitarios y equipamiento spa.', technicalDetails: 'Programado tras sellado hermético de carpinterías.' },
        ],
      };

    case 'proj-003':
      return {
        architecturalSpecs: {
          studioName: 'Grimberg & Asociados Arquitectura Industrial',
          leadArchitect: 'Arq. Roberto Grimberg',
          structuralEngineer: 'Ing. Carlos Pellegrini (Estructuras Metálicas)',
          designConcept:
            'Nave logística Triple A con modulación estructural de 24x12 metros y altura libre de 12,50 metros. Diseñada para máxima densidad de pallets y cruce de andén (cross-docking).',
          sustainabilityRating: 'Norma FM Global & LEED Logistics Certified',
          totalBuiltAreaM2: 32000,
          sellableAreaM2: 29500,
          floorsCount: 1,
          subfloorsCount: 0,
          totalUnitsCount: 4,
          amenitiesDescription:
            'Playa de maniobras de hormigón H-30 de 45 metros, 32 docks de carga con niveladores hidráulicos, comedor para transportistas y oficinas operativas.',
        },
        constructionData: {
          generalContractor: 'Constructora Sudamericana S.A.',
          technicalAuditor: 'SGS Argentina',
          permitNumber: 'HAB-IND-CAMPANA-2025-091',
          workStartDate: '15 de Mayo de 2026',
          estimatedDeliveryDate: '30 de Noviembre de 2027',
          insurancePolicy: 'Allianz - Póliza Integral de Construcción #441920',
          fiduciaryTrustee: 'Rosario Fiduciaria S.A.',
          notaryPublic: 'Escribanía Martínez & Asociados',
          currentWorkStatusSummary:
            'Nivelación y consolidación de suelo con cal completada. Montaje del 60% de las columnas de alma llena metálicas.',
        },
        budgetAudit: {
          totalBudgetUSD: 2000000,
          executedBudgetUSD: 300000,
          rubrosSummary: [
            { rubro: '1. Movimiento de Suelos y Pavimentos Pesados', budgetedUSD: 450000, executedUSD: 180000, percentage: 40 },
            { rubro: '2. Estructura Metálica y Cubierta Termoacústica', budgetedUSD: 780000, executedUSD: 95000, percentage: 12 },
            { rubro: '3. Pisos Industriales con Nivelación Láser', budgetedUSD: 320000, executedUSD: 0, percentage: 0 },
            { rubro: '4. Sistema Contra Incendio (Sprinklers ESFR)', budgetedUSD: 240000, executedUSD: 15000, percentage: 6 },
            { rubro: '5. Dársenas, Niveladores y Oficinas', budgetedUSD: 120000, executedUSD: 0, percentage: 0 },
            { rubro: '6. Honorarios, Seguros y Dirección Técnica', budgetedUSD: 90000, executedUSD: 10000, percentage: 11 },
          ],
          budgetItems: [
            { id: 'mat-301', category: 'material', concept: 'Pórticos de Acero Laminado Alma Llena', details: 'Estructura principal de naves', quantity: 180, unit: 'ton', unitPriceUSD: 1650, totalUSD: 297000, datePaid: '2026-07-15', recipientOrSupplier: 'Estructuras Metálicas Rosarinas', receiptNumber: 'FC-A-0012-9901' },
            { id: 'mat-302', category: 'material', concept: 'Suelo Cal y Tosca Compactada', details: 'Bases de playa de maniobras', quantity: 8500, unit: 'm³', unitPriceUSD: 18, totalUSD: 153000, datePaid: '2026-06-20', recipientOrSupplier: 'Canteras Campana S.A.', receiptNumber: 'FC-A-0004-1290' },
            { id: 'pay-301', category: 'payroll', concept: 'Montadores Especializados y Soldadores Calificados', details: 'Equipo certificado en altura', totalUSD: 42000, datePaid: '2026-08-30', recipientOrSupplier: 'UOCRA Seccional Zárate-Campana', receiptNumber: 'REC-HAB-08-2026' },
            { id: 'eq-301', category: 'equipment', concept: 'Grúas Telescópicas 70 Toneladas', details: 'Montaje de cerchas y vigas', totalUSD: 28500, datePaid: '2026-08-10', recipientOrSupplier: 'Gruas Moviles del Plata', receiptNumber: 'FC-A-0081-3310' },
          ],
        },
        progressMilestones: [
          { id: 'm-301', date: '20/06/2026', title: 'Topografía y Movimiento de Suelos', phase: 'Suelos', percentage: 100, inspector: 'Ing. Pablo Rossi (SGS)', status: 'completed', reportSummary: 'Densidad Proctor alcanzada al 98%.', technicalDetails: 'Ensayos de carga sobre suelo compactado superaron los requerimientos.' },
          { id: 'm-302', date: '15/09/2026', title: 'Bases de Hormigón y Anclajes', phase: 'Fundaciones', percentage: 100, inspector: 'Ing. Pablo Rossi (SGS)', status: 'completed', reportSummary: 'Bulonería de alta resistencia ajustada con torquímetro.', technicalDetails: 'Hormigón H-30 de bases certificado.' },
          { id: 'm-303', date: '30/11/2026', title: 'Montaje de Cerchas Metálicas y Cubiertas', phase: 'Estructura', percentage: 15, inspector: 'Ing. Pablo Rossi (SGS)', status: 'in_progress', reportSummary: 'Izaje seguro bajo protocolo de vientos menores a 30 km/h.', technicalDetails: 'Colocación de paneles aislantes PUR con retardante de llama.' },
        ],
      };

    default: // Default / proj-001 (Torre Krea Nova I)
      return {
        architecturalSpecs: {
          studioName: 'BMA Arquitectos & Asociados',
          leadArchitect: 'Arq. Juan Martín Dujovne (CPAU 14.892)',
          structuralEngineer: 'Ing. Alberto Fainstein (Cálculo Estructural Avanzado)',
          landscapeDesign: 'Estudio Bulla Paisajismo Bioclimático',
          designConcept:
            'Estructura de hormigón a la vista combinada con piel de vidrio y terrazas verdes bioclimáticas. Plantas libres de 450 m² sin columnas intermedias, diseñadas para máxima eficiencia espacial y bienestar laboral.',
          sustainabilityRating: 'Certificación LEED Gold (V4.1 Building Design)',
          totalBuiltAreaM2: 14850,
          sellableAreaM2: 11200,
          floorsCount: 22,
          subfloorsCount: 2,
          totalUnitsCount: 64,
          amenitiesDescription:
            'Rooftop lounge con vista panorámica, auditorio corporativo modular, salas de conferencias con aislamiento acústico STC-50, vestuarios y bicicleteros para movilidad sustentable.',
        },
        constructionData: {
          generalContractor: 'CRIBA S.A.',
          technicalAuditor: 'Bureau Veritas Argentina',
          permitNumber: 'EXP-CABA-88192/2025 (Permiso de Obra Nueva)',
          workStartDate: '15 de Enero de 2026',
          estimatedDeliveryDate: '30 de Diciembre de 2027',
          insurancePolicy: 'All Risk Construction (La Holando Sudamericana #992144)',
          fiduciaryTrustee: 'Banco de Valores S.A. (Fiduciario Público Registrado)',
          notaryPublic: 'Escribanía Zabaleta & Asoc. (Registro Notarial 412 CABA)',
          currentWorkStatusSummary:
            'Finalizado el colado de losas hasta el piso 10. Ensayos a compresión a 28 días superaron los 35 MPa reglamentarios (CIRSOC 201). Se inician cerramientos perimetrales y montantes de sanitarios.',
        },
        budgetAudit: {
          totalBudgetUSD: 750000,
          executedBudgetUSD: 315000,
          rubrosSummary: [
            { rubro: '1. Movimiento de Suelos, Pilotaje y Fundaciones', budgetedUSD: 110000, executedUSD: 110000, percentage: 100 },
            { rubro: '2. Estructura de Hormigón Armado y Encofrados', budgetedUSD: 230000, executedUSD: 125000, percentage: 54 },
            { rubro: '3. Albañilería, Mampostería y Contrapisos', budgetedUSD: 95000, executedUSD: 32000, percentage: 33 },
            { rubro: '4. Instalaciones Sanitarias, Termomecánicas y Gas', budgetedUSD: 85000, executedUSD: 18000, percentage: 21 },
            { rubro: '5. Carpinterías de Aluminio DVH y Fachadas', budgetedUSD: 105000, executedUSD: 12000, percentage: 11 },
            { rubro: '6. Terminaciones, Revestimientos y Pintura', budgetedUSD: 65000, executedUSD: 0, percentage: 0 },
            { rubro: '7. Honorarios Profesionales, Tasas y Seguros', budgetedUSD: 60000, executedUSD: 18000, percentage: 30 },
          ],
          budgetItems: [
            { id: 'b-01', category: 'material', concept: 'Hormigón Elaborado H-30 Bombeable', details: 'Losas y columnas pisos 1 al 10', quantity: 840, unit: 'm³', unitPriceUSD: 90, totalUSD: 75600, datePaid: '2026-04-18', recipientOrSupplier: 'Loma Negra / FC-A-0004-9812', receiptNumber: 'FC-9812' },
            { id: 'b-02', category: 'material', concept: 'Acero Conformado ADN-420 (diámetros 10 a 25mm)', details: 'Armaduras estructurales de tracción', quantity: 48, unit: 'ton', unitPriceUSD: 1100, totalUSD: 52800, datePaid: '2026-03-22', recipientOrSupplier: 'Acindar S.A. / FC-A-0102-4411', receiptNumber: 'FC-4411' },
            { id: 'b-03', category: 'material', concept: 'Encofrados Fenólicos y Puntales Telescópicos', details: 'Sistemas modulares reutilizables', quantity: 1200, unit: 'm²', unitPriceUSD: 13.6, totalUSD: 16400, datePaid: '2026-02-14', recipientOrSupplier: 'Peri Argentina / FC-A-0012-3011', receiptNumber: 'FC-3011' },
            { id: 'b-04', category: 'material', concept: 'Ladrillos Cerámicos Huecos 12x18x33', details: 'Tabiques divisorios y muros cortafuego', quantity: 18500, unit: 'unidades', unitPriceUSD: 0.7, totalUSD: 12950, datePaid: '2026-06-10', recipientOrSupplier: 'Cerámica Quilmes / FC-A-0033-8812', receiptNumber: 'FC-8812' },
            { id: 'b-05', category: 'material', concept: 'Cañerías Polipropileno Termofusión Acqua System', details: 'Montantes de agua fría y caliente sanitaria', quantity: 950, unit: 'metros', unitPriceUSD: 9.15, totalUSD: 8700, datePaid: '2026-07-04', recipientOrSupplier: 'Grupo Dema / FC-A-0081-1209', receiptNumber: 'FC-1209' },
            { id: 'b-06', category: 'material', concept: 'Cables Subterráneos Sintenax y Bandejas Metálicas', details: 'Alimentadores principales de baja tensión', quantity: 1400, unit: 'metros', unitPriceUSD: 8, totalUSD: 11200, datePaid: '2026-07-19', recipientOrSupplier: 'Prysmian Group / FC-A-0021-9943', receiptNumber: 'FC-9943' },
            { id: 'b-07', category: 'payroll', concept: 'Capataz General y Jefatura de Obra', details: '1 capataz + 1 sobrestante técnico (8 meses certificados)', totalUSD: 24000, datePaid: '2026-08-05', recipientOrSupplier: 'CRIBA S.A. / Libro Sueldos Digital', receiptNumber: 'LSD-08-2026' },
            { id: 'b-08', category: 'payroll', concept: 'Oficiales Especializados (Armadores y Encofradores)', details: '14 operarios de cuadrilla de hormigón armado', totalUSD: 48600, datePaid: '2026-08-05', recipientOrSupplier: 'CCT UOCRA 76/75 Quincenas 1 a 16', receiptNumber: 'UOCRA-Q16' },
            { id: 'b-09', category: 'payroll', concept: 'Oficiales Albañiles y Medios Oficiales', details: '10 operarios abocados a mampostería y aislaciones', totalUSD: 28400, datePaid: '2026-08-05', recipientOrSupplier: 'CCT UOCRA 76/75 Quincenas 9 a 16', receiptNumber: 'UOCRA-Q16B' },
            { id: 'b-10', category: 'payroll', concept: 'Ayudantes y Peones de Apoyo General', details: '8 operarios de logística interna y limpieza', totalUSD: 19200, datePaid: '2026-08-05', recipientOrSupplier: 'CCT UOCRA 76/75 Quincenas 1 a 16', receiptNumber: 'UOCRA-PEON' },
            { id: 'b-11', category: 'payroll', concept: 'Cargas Sociales Patronales (AFIP F.931) y ART', details: 'Aportes previsionales, obra social y seguro de vida', totalUSD: 31800, datePaid: '2026-08-10', recipientOrSupplier: 'AFIP / La Segunda ART', receiptNumber: 'VEP-992144' },
            { id: 'b-12', category: 'equipment', concept: 'Alquiler de Grúa Torre Potain 45m de Pluma', details: 'Servicio mensual con operador certificado y seguro', totalUSD: 21000, datePaid: '2026-07-28', recipientOrSupplier: 'Grúas San Blas S.A.', receiptNumber: 'FC-A-0014-7721' },
            { id: 'b-13', category: 'equipment', concept: 'Servicios de Bombeo de Hormigón Pluma 36m', details: '24 operativos de colado de losas', totalUSD: 14400, datePaid: '2026-06-30', recipientOrSupplier: 'ServiHormigón S.R.L.', receiptNumber: 'FC-A-0005-9912' },
            { id: 'b-14', category: 'equipment', concept: 'Excavadora sobre orugas CAT 320D (subsuelos)', details: '180 horas de excavación profunda en tosca', totalUSD: 11700, datePaid: '2026-02-28', recipientOrSupplier: 'Vialmac Maquinarias', receiptNumber: 'FC-A-0022-3841' },
            { id: 'b-15', category: 'permits_fees', concept: 'Derechos de Delineación y Construcción GCBA', details: 'Tasas municipales y liquidación DGFyCO', totalUSD: 12500, datePaid: '2026-01-10', recipientOrSupplier: 'Dirección General de Fiscalización y Control de Obras', receiptNumber: 'BO-CABA-9912' },
            { id: 'b-16', category: 'permits_fees', concept: 'Honorarios de Auditoría Técnica y Control de Calidad', details: 'Certificaciones mensuales y ensayos de rotura de probetas', totalUSD: 5500, datePaid: '2026-07-31', recipientOrSupplier: 'Bureau Veritas Argentina S.A.', receiptNumber: 'FC-A-0099-2311' },
          ],
        },
        progressMilestones: [
          {
            id: 'mil-01',
            date: '15 de Enero de 2026',
            title: 'Acta de Replanteo y Movimiento de Suelos',
            phase: 'Fundaciones',
            percentage: 100,
            inspector: 'Ing. Roberto Calvo (Auditor Bureau Veritas)',
            status: 'completed',
            reportSummary: 'Demolición de preexistencias y excavación de 2 subsuelos concluida.',
            technicalDetails: 'Excavación de 6.400 m³ de suelo tosca. Ensayos de penetración estándar SPT conformes a informe geitécnico previo.',
          },
          {
            id: 'mil-02',
            date: '28 de Febrero de 2026',
            title: 'Hormigonado de Cabezales y Losa de Subsuelos',
            phase: 'Fundaciones',
            percentage: 100,
            inspector: 'Ing. Roberto Calvo (Auditor Bureau Veritas)',
            status: 'completed',
            reportSummary: 'Colado continuo de 480 m³ de hormigón H-30 con aditivo impermeabilizante.',
            technicalDetails: 'Ensayos a compresión de probetas testigo arrojaron f´c = 34.2 MPa a 28 días, superando los 30 MPa de cálculo.',
          },
          {
            id: 'mil-03',
            date: '20 de Mayo de 2026',
            title: 'Estructura Resistente hasta Nivel +18.00m (Piso 5)',
            phase: 'Estructura',
            percentage: 100,
            inspector: 'Ing. Roberto Calvo (Auditor Bureau Veritas)',
            status: 'completed',
            reportSummary: 'Desencofrado y apuntalamiento de vigas y losas sin fisuras térmicas.',
            technicalDetails: 'Control geométrico topográfico con estación total: desviaciones milimétricas dentro de tolerancias CIRSOC.',
          },
          {
            id: 'mil-04',
            date: '10 de Agosto de 2026',
            title: 'Hormigonado de Losa de Piso 10 y Núcleo de Ascensores',
            phase: 'Estructura',
            percentage: 100,
            inspector: 'Ing. Roberto Calvo (Auditor Bureau Veritas)',
            status: 'completed',
            reportSummary: 'Completado el 42% del volumen estructural total proyectado.',
            technicalDetails: 'Núcleo rígido antisísmico completado hasta cota +33.00m. Aprobación pericial para desembolso del tramo 4 de fondos.',
          },
          {
            id: 'mil-05',
            date: 'En Curso (Octubre 2026)',
            title: 'Mampostería Perimetral y Montantes Sanitarias e Incendio',
            phase: 'Instalaciones & Cerramientos',
            percentage: 35,
            inspector: 'Ing. Roberto Calvo (Auditor Bureau Veritas)',
            status: 'in_progress',
            reportSummary: 'Levantamiento de tabiques interiores en pisos 2, 3 y 4. Colocación de cajas eléctricas y montantes cloacales.',
            technicalDetails: 'Pruebas de presión hidrostática en cañerías sanitarias aprobadas a 8 bar de presión durante 4 horas.',
          },
          {
            id: 'mil-06',
            date: 'Estimado: Febrero 2027',
            title: 'Montaje de Muro Cortina y Fachada de Vidrio DVH',
            phase: 'Fachadas',
            percentage: 0,
            inspector: 'Ing. Roberto Calvo (Auditor Bureau Veritas)',
            status: 'upcoming',
            reportSummary: 'Instalación de paneles dobles de vidrio de control solar y perfiles de aluminio Aluar.',
            technicalDetails: 'Fase programada una vez finalizado el hormigonado hasta piso 18.',
          },
        ],
      };
  }
}
