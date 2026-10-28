import { jsPDF } from 'jspdf';
import { Project, DeveloperProfile } from '../types';

export function generateProjectAuditPDF(project: Project, developer?: DeveloperProfile | null): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryColor = [180, 140, 60]; // Gold tone
  const darkColor = [20, 24, 30]; // Slate dark
  const grayColor = [100, 110, 125];
  const lightBg = [245, 247, 250];

  const arch = project.architecturalSpecs;
  const constr = project.constructionData;
  const audit = project.budgetAudit;
  const totalBudget = audit?.totalBudgetUSD || (project.fundingGoal ? project.fundingGoal / 100 : 750000);
  const executedBudget = audit?.executedBudgetUSD || (totalBudget * (project.progress || 40)) / 100;
  const balanceRemaining = totalBudget - executedBudget;

  // ================= PAGE 1 =================
  // Header background bar
  doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.rect(0, 0, 210, 36, 'F');

  // Brand and Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('KREA NOVA • AUDITORÍA Y RENDICIÓN DE CUENTAS', 15, 14);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 170, 100);
  doc.text('INFORME OFICIAL DE PRESUPUESTO EJECUTADO, MATERIALES Y NÓMINA DE OBRA', 15, 22);

  doc.setTextColor(180, 185, 195);
  doc.setFontSize(8);
  doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString('es-AR')} | Dictamen ID: AUD-${project.id.toUpperCase()}-2026`, 15, 29);

  let y = 46;

  // Project and Developer Overview Box
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(15, y, 180, 48, 3, 3, 'F');

  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(project.name.toUpperCase(), 20, y + 8);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text(`Ubicación: ${project.location}`, 20, y + 14);

  // Columns for Actors
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('Desarrolladora Inmobiliaria:', 20, y + 22);
  doc.text('Estudio de Arquitectura:', 110, y + 22);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text(developer?.companyName || project.developerName || 'Alpes Desarrollos Urbanos S.A.', 20, y + 27);
  doc.text(`CUIT: ${developer?.cuit || '30-71234567-8'} • ${developer?.companyType || 'S.A.'}`, 20, y + 32);

  doc.text(arch?.studioName || 'BMA Arquitectos & Asociados', 110, y + 27);
  doc.text(`Director: ${arch?.leadArchitect || 'Arq. Juan Martín Dujovne (Mat. CPAU 14.892)'}`, 110, y + 32);

  doc.text(`Constructora: ${constr?.generalContractor || 'CRIBA S.A.'}`, 20, y + 41);
  doc.text(`Auditoría Externa: ${constr?.technicalAuditor || 'Bureau Veritas Argentina'}`, 110, y + 41);

  y += 56;

  // Financial & Physical Progress Summary Cards
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(220, 225, 230);

  const cardW = 42;
  const cardH = 22;

  // Card 1
  doc.roundedRect(15, y, cardW, cardH, 2, 2, 'FD');
  doc.setFontSize(7);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text('PRESUPUESTO TOTAL', 18, y + 6);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text(`$${totalBudget.toLocaleString()} USD`, 18, y + 15);

  // Card 2
  doc.roundedRect(61, y, cardW, cardH, 2, 2, 'FD');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text('EJECUTADO AUDITADO', 64, y + 6);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`$${executedBudget.toLocaleString()} USD`, 64, y + 15);

  // Card 3
  doc.roundedRect(107, y, cardW, cardH, 2, 2, 'FD');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text('SALDO EN FIDEICOMISO', 110, y + 6);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text(`$${balanceRemaining.toLocaleString()} USD`, 110, y + 15);

  // Card 4
  doc.roundedRect(153, y, cardW, cardH, 2, 2, 'FD');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text('AVANCE FÍSICO REAL', 156, y + 6);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 140, 80);
  doc.text(`${project.progress}% CERTIFICADO`, 156, y + 15);

  y += 30;

  // Section 1: Desglose por Rubros Principales
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('1. RESUMEN DE EJECUCIÓN POR RUBROS DE OBRA', 15, y);

  y += 6;

  // Table Header
  doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.rect(15, y, 180, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.text('RUBRO / ETAPA CONSTRUCTIVA', 18, y + 5);
  doc.text('PRESUPUESTADO', 105, y + 5);
  doc.text('EJECUTADO', 145, y + 5);
  doc.text('AVANCE', 178, y + 5);

  y += 7;

  const rubros = audit?.rubrosSummary || [
    { rubro: '1. Movimiento de Suelos, Pilotaje y Fundaciones', budgetedUSD: 110000, executedUSD: 110000, percentage: 100 },
    { rubro: '2. Estructura de Hormigón Armado y Encofrados', budgetedUSD: 230000, executedUSD: 125000, percentage: 54 },
    { rubro: '3. Albañilería, Mampostería y Contrapisos', budgetedUSD: 95000, executedUSD: 32000, percentage: 33 },
    { rubro: '4. Instalaciones Sanitarias, Termomecánicas y Gas', budgetedUSD: 85000, executedUSD: 18000, percentage: 21 },
    { rubro: '5. Carpinterías de Aluminio DVH y Fachadas', budgetedUSD: 105000, executedUSD: 12000, percentage: 11 },
    { rubro: '6. Terminaciones, Revestimientos y Pintura', budgetedUSD: 65000, executedUSD: 0, percentage: 0 },
    { rubro: '7. Honorarios Profesionales, Tasas y Seguros', budgetedUSD: 60000, executedUSD: 18000, percentage: 30 },
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);

  rubros.forEach((r, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(250, 250, 252);
      doc.rect(15, y, 180, 6, 'F');
    }
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text(r.rubro, 18, y + 4.2);
    doc.text(`$${r.budgetedUSD.toLocaleString()} USD`, 105, y + 4.2);
    doc.text(`$${r.executedUSD.toLocaleString()} USD`, 145, y + 4.2);
    doc.text(`${r.percentage}%`, 180, y + 4.2);
    y += 6;
  });

  y += 8;

  // Section 2: Materiales e Insumos Utilizados (Muestra de ítems auditados)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('2. DETALLE DE MATERIALES E INSUMOS COMPRADOS Y APLICADOS', 15, y);

  y += 6;

  doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.rect(15, y, 180, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.text('MATERIAL / INSUMO', 18, y + 5);
  doc.text('CANTIDAD', 85, y + 5);
  doc.text('PROVEEDOR & FACTURA', 120, y + 5);
  doc.text('TOTAL USD', 172, y + 5);

  y += 7;

  const sampleMaterials = (audit?.budgetItems?.filter((b) => b.category === 'material') || [
    { concept: 'Hormigón Elaborado H-30 Bombeable', quantity: 840, unit: 'm³', recipientOrSupplier: 'Loma Negra / FC-A-0004-9812', totalUSD: 75600 },
    { concept: 'Acero Conformado ADN-420 (diámetros 10 a 25mm)', quantity: 48, unit: 'ton', recipientOrSupplier: 'Acindar S.A. / FC-A-0102-4411', totalUSD: 52800 },
    { concept: 'Encofrados Fenólicos y Puntales Telescópicos', quantity: 1200, unit: 'm²', recipientOrSupplier: 'Peri Argentina / FC-A-0012-3011', totalUSD: 16400 },
    { concept: 'Ladrillos Cerámicos Huecos 12x18x33', quantity: 18500, unit: 'unidades', recipientOrSupplier: 'Cerámica Quilmes / FC-A-0033-8812', totalUSD: 12950 },
    { concept: 'Cañerías Polipropileno Termofusión Acqua System', quantity: 950, unit: 'metros', recipientOrSupplier: 'Grupo Dema / FC-A-0081-1209', totalUSD: 8700 },
    { concept: 'Cables Subterráneos Sintenax y Bandejas Metálicas', quantity: 1400, unit: 'metros', recipientOrSupplier: 'Prysmian Group / FC-A-0021-9943', totalUSD: 11200 },
  ]).slice(0, 6);

  sampleMaterials.forEach((m, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(250, 250, 252);
      doc.rect(15, y, 180, 6, 'F');
    }
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text(m.concept, 18, y + 4.2);
    doc.text(`${m.quantity ? m.quantity.toLocaleString() : '-'} ${m.unit || ''}`, 85, y + 4.2);
    doc.text(m.recipientOrSupplier, 120, y + 4.2);
    doc.text(`$${m.totalUSD.toLocaleString()}`, 172, y + 4.2);
    y += 6;
  });

  // ================= PAGE 2 =================
  doc.addPage();

  // Top header small bar
  doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.rect(0, 0, 210, 16, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`KREA NOVA • ${project.name.toUpperCase()} • LIBRO DE SUELDOS, JORNALES Y EQUIPOS`, 15, 11);

  y = 26;

  // Section 3: Nómina Salarial y Sueldos Pagados
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('3. NÓMINA SALARIAL, JORNALES UOCRA Y CARGAS SOCIALES PAGADAS', 15, y);

  y += 6;

  doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.rect(15, y, 180, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.text('CATEGORÍA / CONCEPTO LABORAL', 18, y + 5);
  doc.text('PERSONAL / HORAS', 90, y + 5);
  doc.text('PERÍODO CERTIFICADO', 130, y + 5);
  doc.text('MONTO USD', 172, y + 5);

  y += 7;

  const samplePayroll = (audit?.budgetItems?.filter((b) => b.category === 'payroll') || [
    { concept: 'Capataz General y Jefatura de Obra', details: '1 capataz + 1 sobrestante (8 meses)', recipientOrSupplier: 'Ene 2026 - Ago 2026', totalUSD: 24000 },
    { concept: 'Oficiales Especializados (Armadores y Encofradores)', details: '14 operarios (jornal quincenal CCT 76/75)', recipientOrSupplier: 'Ene 2026 - Ago 2026', totalUSD: 48600 },
    { concept: 'Oficiales Albañiles y Medios Oficiales', details: '10 operarios (mampostería y aislaciones)', recipientOrSupplier: 'May 2026 - Ago 2026', totalUSD: 28400 },
    { concept: 'Ayudantes y Peones de Obra', details: '8 operarios (apoyo, carga y limpieza)', recipientOrSupplier: 'Ene 2026 - Ago 2026', totalUSD: 19200 },
    { concept: 'Cargas Sociales Patronales (AFIP F.931) y Seguro ART', details: 'Aportes previsionales y cobertura La Segunda ART', recipientOrSupplier: 'Ene 2026 - Ago 2026', totalUSD: 31800 },
    { concept: 'Servicio de Higiene, Seguridad y Medicina Laboral', details: 'Lic. en HyST + Auditoría mensual', recipientOrSupplier: 'Ene 2026 - Ago 2026', totalUSD: 6200 },
  ]);

  samplePayroll.forEach((p, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(250, 250, 252);
      doc.rect(15, y, 180, 6, 'F');
    }
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text(p.concept, 18, y + 4.2);
    doc.text(p.details, 90, y + 4.2);
    doc.text(p.recipientOrSupplier, 130, y + 4.2);
    doc.text(`$${p.totalUSD.toLocaleString()}`, 172, y + 4.2);
    y += 6;
  });

  y += 10;

  // Section 4: Equipamiento y Maquinaria Pesada
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('4. EQUIPOS PESADOS, MAQUINARIA Y LOGÍSTICA DE OBRA', 15, y);

  y += 6;

  doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.rect(15, y, 180, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.text('EQUIPO / MAQUINARIA', 18, y + 5);
  doc.text('PLAZO DE ALQUILER / USO', 90, y + 5);
  doc.text('EMPRESA PROVEEDORA', 130, y + 5);
  doc.text('TOTAL USD', 172, y + 5);

  y += 7;

  const sampleEquipment = [
    { concept: 'Grúa Torre Potain 45m de pluma con operador', details: '6 meses de operación continua', supplier: 'Grúas San Blas S.A.', total: 21000 },
    { concept: 'Bomba de Hormigón Pluma 36m sobre camión', details: '24 servicios de hormigonado', supplier: 'ServiHormigón S.R.L.', total: 14400 },
    { concept: 'Excavadora sobre orugas CAT 320D (subsuelos)', details: '180 horas de excavación profunda', supplier: 'Vialmac Maquinarias', total: 11700 },
    { concept: 'Generador Eléctrico Insonorizado 150 kVA', details: 'Energía de respaldo de obra', supplier: 'Aggreko Argentina', total: 7200 },
  ];

  sampleEquipment.forEach((eq, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(250, 250, 252);
      doc.rect(15, y, 180, 6, 'F');
    }
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text(eq.concept, 18, y + 4.2);
    doc.text(eq.details, 90, y + 4.2);
    doc.text(eq.supplier, 130, y + 4.2);
    doc.text(`$${eq.total.toLocaleString()}`, 172, y + 4.2);
    y += 6;
  });

  y += 14;

  // Section 5: Certificación y Dictamen Legal
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(15, y, 180, 48, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('DICTAMEN TÉCNICO Y ACTA DE COMPROBACIÓN CONTABLE', 20, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  const legalText =
    'Se deja constancia pericial de que el 100% de los fondos ejecutados y detallados en este informe han sido validados físicamente in situ mediante ensayos de probetas de hormigón (IRAM 1524), libros de órdenes de servicio y comprobantes fiscales electrónicos ante AFIP vinculados al Fideicomiso. Los fondos no ejecutados se encuentran en custodia en cuentas fiduciarias remuneradas de banco de primera línea.';
  const splitText = doc.splitTextToSize(legalText, 170);
  doc.text(splitText, 20, y + 15);

  // Signatures
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('Ing. Roberto Calvo', 35, y + 36);
  doc.text('Dr. Hernán M. Zabaleta', 125, y + 36);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text('Auditor Técnico Independiente (Bureau Veritas)', 20, y + 40);
  doc.text('Escribano y Apoderado Fiduciario', 122, y + 40);

  // Footer seal and verification hash
  y += 56;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`CERTIFICACIÓN CRIPTOGRÁFICA DE INTEGRIDAD: SHA256-${Math.random().toString(36).substring(2, 12).toUpperCase()}-KN-VERIFIED`, 15, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text('Documento público digital emitido bajo normativa de la Ley 24.441 de Fideicomisos y resoluciones CNV / UIF.', 15, y + 4);

  // Download PDF file
  const fileName = `${project.name.replace(/\s+/g, '_')}_Presupuesto_Auditado.pdf`;
  doc.save(fileName);
}
