export interface ReceiptData {
  patientName: string;
  patientPhone: string;
  doctorName?: string;
  doctorQualification?: string;
  doctorSpecialization?: string;
  doctorRegistration?: string;
  service: string;
  date: string;
  time: string;
  referenceId: string;
  clinicName?: string;
  clinicTagline?: string;
  clinicAddress?: string;
  clinicCity?: string;
  clinicPhone?: string;
  clinicSecondaryPhone?: string;
}

export function generateAppointmentReceiptDataUrl(data: ReceiptData): string {
  if (typeof document === 'undefined') return '';

  const canvas = document.createElement('canvas');
  const width = 900;
  const height = 1200;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background
  ctx.fillStyle = '#f8fafc'; // slate-50
  ctx.fillRect(0, 0, width, height);

  // Outer Border
  ctx.strokeStyle = '#cbd5e1'; // slate-300
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  // Header Banner
  const headerGradient = ctx.createLinearGradient(0, 0, width, 220);
  headerGradient.addColorStop(0, '#090d16'); // slate-950
  headerGradient.addColorStop(1, '#0f172a'); // slate-900
  ctx.fillStyle = headerGradient;
  ctx.fillRect(20, 20, width - 40, 220);

  // Teal decorative strip
  ctx.fillStyle = '#0d9488'; // teal-600
  ctx.fillRect(20, 238, width - 40, 6);

  // Clinic Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 30px "Cinzel", "Times New Roman", serif';
  ctx.textAlign = 'center';
  ctx.fillText(data.clinicName || 'CLASSIC SMILE DENTAL CARE & IMPLANT CENTRE', width / 2, 75);

  // Tagline
  ctx.fillStyle = '#5eead4'; // teal-300
  ctx.font = 'italic 18px "Georgia", serif';
  ctx.fillText(`"${data.clinicTagline || 'Your step towards dental wellness'}"`, width / 2, 110);

  // Address
  ctx.fillStyle = '#cbd5e1'; // slate-300
  ctx.font = '14px system-ui, -apple-system, sans-serif';
  ctx.fillText(
    data.clinicAddress || 'Shop No. 18, T Wing, Tanish Orchid, 1st Floor, Charholi Bk., Pune - 412105',
    width / 2,
    145
  );

  // Helpline
  ctx.fillStyle = '#e2e8f0'; // slate-200
  ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
  ctx.fillText(
    `Helpline: ${data.clinicPhone || '+91 97632 26605'} | ${data.clinicSecondaryPhone || '+91 90751 78442'}`,
    width / 2,
    180
  );

  // Doctor credentials strip
  ctx.fillStyle = '#94a3b8'; // slate-400
  ctx.font = '13px system-ui, -apple-system, sans-serif';
  ctx.fillText(
    `Lead Doctor: ${data.doctorName || 'Dr. Abhishek V. Kamble'}, ${data.doctorQualification || 'BDS, MDS'} (Reg: ${data.doctorRegistration || 'A-43344'}) • ${data.doctorSpecialization || 'Periodontist & Oral Implantologist'}`,
    width / 2,
    212
  );

  // Card Header / Title
  ctx.fillStyle = '#0f766e'; // teal-700
  ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
  ctx.fillText('OFFICIAL APPOINTMENT BOOKING SLIP', width / 2, 290);

  // Token Badge Box
  ctx.fillStyle = '#f1f5f9'; // slate-100
  ctx.beginPath();
  roundRect(ctx, 250, 315, 400, 48, 12);
  ctx.fill();
  ctx.strokeStyle = '#0d9488';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 18px monospace';
  ctx.fillText(`BOOKING REF: #${data.referenceId.toUpperCase()}`, width / 2, 346);

  // Appointment Details Container
  const detailsY = 390;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  roundRect(ctx, 60, detailsY, width - 120, 390, 16);
  ctx.fill();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Details items
  const items = [
    { label: 'PATIENT NAME', val: data.patientName },
    { label: 'CONTACT NUMBER', val: data.patientPhone },
    { label: 'APPOINTMENT DATE', val: data.date },
    { label: 'SCHEDULED TIME', val: data.time },
    { label: 'PROCEDURE / SERVICE', val: data.service },
    { label: 'CONSULTING SPECIALIST', val: `${data.doctorName || 'Dr. Abhishek V. Kamble'} (${data.doctorQualification || 'BDS, MDS'})` },
    { label: 'BOOKING STATUS', val: 'CONFIRMED & RESERVED' },
  ];

  ctx.textAlign = 'left';
  let curY = detailsY + 45;
  items.forEach((item, idx) => {
    // Divider line between items
    if (idx > 0) {
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(80, curY - 25);
      ctx.lineTo(width - 80, curY - 25);
      ctx.stroke();
    }

    ctx.fillStyle = '#64748b'; // slate-500
    ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
    ctx.fillText(item.label, 90, curY);

    if (item.label === 'BOOKING STATUS') {
      ctx.fillStyle = '#16a34a'; // green-600
      ctx.font = 'bold 17px system-ui, -apple-system, sans-serif';
    } else if (item.label === 'SCHEDULED TIME' || item.label === 'APPOINTMENT DATE') {
      ctx.fillStyle = '#0f766e'; // teal-700
      ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
    } else {
      ctx.fillStyle = '#0f172a'; // slate-900
      ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
    }

    ctx.fillText(item.val, 360, curY);
    curY += 50;
  });

  // Important Instructions Container
  const noteY = 810;
  ctx.fillStyle = '#f0fdf4'; // green-50
  ctx.beginPath();
  roundRect(ctx, 60, noteY, width - 120, 190, 16);
  ctx.fill();
  ctx.strokeStyle = '#bbf7d0'; // green-200
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#166534'; // green-800
  ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
  ctx.fillText('IMPORTANT INSTRUCTIONS FOR YOUR VISIT:', 90, noteY + 36);

  ctx.fillStyle = '#1e293b';
  ctx.font = '14px system-ui, -apple-system, sans-serif';
  ctx.fillText('1. Please arrive at the clinic 10 minutes prior to your operatory slot.', 90, noteY + 72);
  ctx.fillText('2. Show this digital receipt on your phone or mention your name at the reception desk.', 90, noteY + 104);
  ctx.fillText(`3. In case of rescheduling or delay, call or WhatsApp our helpline at ${data.clinicPhone || '+91 97632 26605'}.`, 90, noteY + 136);
  ctx.fillText('4. Clinic Location: Tanish Orchid, 1st Floor, Charholi Road, Chovisawadi / Charholi Bk., Pune.', 90, noteY + 168);

  // Circular Stamp / Watermark
  drawStamp(ctx, width - 180, 1070);

  // Footer text
  ctx.textAlign = 'center';
  ctx.fillStyle = '#0f766e';
  ctx.font = 'bold 15px "Georgia", serif';
  ctx.fillText('Classic Smile Dental Care & Implant Centre — Your step towards dental wellness', width / 2 - 40, 1060);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px system-ui, -apple-system, sans-serif';
  ctx.fillText('Generated automatically via Classic Smile Dental System • Computer-verified digital slip', width / 2 - 40, 1090);

  return canvas.toDataURL('image/png');
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawStamp(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.1);

  ctx.strokeStyle = '#0d9488'; // teal-600
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 52, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#0f766e';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, 46, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#0f766e';
  ctx.font = 'bold 10px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('CLASSIC SMILE', 0, -22);
  ctx.fillText('★ VERIFIED ★', 0, 0);
  ctx.fillText('APPOINTMENT', 0, 22);

  ctx.restore();
}

export function downloadAppointmentReceiptImage(data: ReceiptData): string {
  try {
    const dataUrl = generateAppointmentReceiptDataUrl(data);
    if (!dataUrl) return '';

    const cleanRef = data.referenceId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `ClassicSmile_Appointment_${cleanRef}.png`;

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return dataUrl;
  } catch (err) {
    console.error('Failed to generate or download receipt image:', err);
    return '';
  }
}
