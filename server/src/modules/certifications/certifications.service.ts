const generateCertificatePdfBuffer = (params: {
  studentName: string;
  courseTitle: string;
  certificateCode: string;
  issuedAt: Date;
  qrCodeBuffer: Buffer;
}): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margin: 0,
      bufferPages: true,
    });

    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const { width, height } = doc.page;

    // ------------------------------------------------------------
    // LearnStack colors
    // ------------------------------------------------------------
    const NAVY = '#111827';
    const DARK = '#1F2937';
    const INDIGO = '#6366F1';
    const INDIGO_DARK = '#4F46E5';
    const TEAL = '#2DD4BF';
    const MUTED = '#64748B';
    const LIGHT = '#F8FAFC';
    const BORDER = '#E2E8F0';

    // ------------------------------------------------------------
    // Background
    // ------------------------------------------------------------
    doc.rect(0, 0, width, height).fill('#FFFFFF');

    // Very subtle top accent area
    doc
      .rect(0, 0, width, 8)
      .fill(INDIGO);

    doc
      .rect(0, 8, width, 3)
      .fill(TEAL);

    // ------------------------------------------------------------
    // Outer certificate frame
    // ------------------------------------------------------------
    doc
      .lineWidth(2)
      .strokeColor(NAVY)
      .rect(24, 24, width - 48, height - 48)
      .stroke();

    // Inner indigo frame
    doc
      .lineWidth(1)
      .strokeColor(INDIGO)
      .rect(32, 32, width - 64, height - 64)
      .stroke();

    // ------------------------------------------------------------
    // Decorative corner elements
    // ------------------------------------------------------------

    // Top-left
    doc
      .lineWidth(3)
      .strokeColor(TEAL)
      .moveTo(48, 48)
      .lineTo(100, 48)
      .stroke();

    doc
      .lineWidth(3)
      .strokeColor(TEAL)
      .moveTo(48, 48)
      .lineTo(48, 72)
      .stroke();

    // Top-right
    doc
      .lineWidth(3)
      .strokeColor(TEAL)
      .moveTo(width - 100, 48)
      .lineTo(width - 48, 48)
      .stroke();

    doc
      .lineWidth(3)
      .strokeColor(TEAL)
      .moveTo(width - 48, 48)
      .lineTo(width - 48, 72)
      .stroke();

    // Bottom-left
    doc
      .lineWidth(3)
      .strokeColor(INDIGO)
      .moveTo(48, height - 48)
      .lineTo(100, height - 48)
      .stroke();

    doc
      .lineWidth(3)
      .strokeColor(INDIGO)
      .moveTo(48, height - 72)
      .lineTo(48, height - 48)
      .stroke();

    // Bottom-right
    doc
      .lineWidth(3)
      .strokeColor(INDIGO)
      .moveTo(width - 100, height - 48)
      .lineTo(width - 48, height - 48)
      .stroke();

    doc
      .lineWidth(3)
      .strokeColor(INDIGO)
      .moveTo(width - 48, height - 72)
      .lineTo(width - 48, height - 48)
      .stroke();

    // ------------------------------------------------------------
    // LearnStack branding
    // ------------------------------------------------------------
    doc
      .font('Helvetica-Bold')
      .fontSize(13)
      .fillColor(NAVY)
      .text('LEARN', 58, 65, {
        continued: true,
      });

    doc
      .fillColor(INDIGO)
      .text('STACK');

    doc
      .font('Helvetica')
      .fontSize(7)
      .fillColor(MUTED)
      .text('LEARNING PLATFORM', 58, 81);

    // ------------------------------------------------------------
    // Verified badge
    // ------------------------------------------------------------
    const badgeX = width - 118;
    const badgeY = 72;

    doc
      .circle(badgeX, badgeY, 20)
      .fillColor('#EEF2FF')
      .fill();

    doc
      .circle(badgeX, badgeY, 16)
      .lineWidth(1.5)
      .strokeColor(INDIGO)
      .stroke();

    // Check mark
    doc
      .lineWidth(2)
      .strokeColor(TEAL)
      .moveTo(badgeX - 7, badgeY)
      .lineTo(badgeX - 2, badgeY + 5)
      .lineTo(badgeX + 8, badgeY - 6)
      .stroke();

    doc
      .font('Helvetica-Bold')
      .fontSize(6)
      .fillColor(INDIGO_DARK)
      .text('VERIFIED', badgeX - 21, badgeY + 25, {
        width: 42,
        align: 'center',
      });

    // ------------------------------------------------------------
    // Main heading
    // ------------------------------------------------------------
    doc
      .font('Helvetica-Bold')
      .fontSize(30)
      .fillColor(NAVY)
      .text('CERTIFICATE OF COMPLETION', 0, 120, {
        width,
        align: 'center',
      });

    // Accent line
    doc
      .lineWidth(2)
      .strokeColor(INDIGO)
      .moveTo(width / 2 - 70, 160)
      .lineTo(width / 2 + 70, 160)
      .stroke();

    doc
      .circle(width / 2, 160, 3)
      .fillColor(TEAL)
      .fill();

    // ------------------------------------------------------------
    // Intro text
    // ------------------------------------------------------------
    doc
      .font('Helvetica')
      .fontSize(11)
      .fillColor(MUTED)
      .text('THIS CERTIFICATE IS PROUDLY PRESENTED TO', 0, 180, {
        width,
        align: 'center',
        characterSpacing: 1.2,
      });

    // ------------------------------------------------------------
    // Student name
    // ------------------------------------------------------------
    doc
      .font('Helvetica-Bold')
      .fontSize(28)
      .fillColor(NAVY)
      .text(params.studentName, 100, 207, {
        width: width - 200,
        align: 'center',
      });

    // Underline
    doc
      .lineWidth(1)
      .strokeColor(BORDER)
      .moveTo(width / 2 - 170, 247)
      .lineTo(width / 2 + 170, 247)
      .stroke();

    // ------------------------------------------------------------
    // Completion text
    // ------------------------------------------------------------
    doc
      .font('Helvetica')
      .fontSize(11)
      .fillColor(MUTED)
      .text('for successfully completing the course', 0, 263, {
        width,
        align: 'center',
      });

    // ------------------------------------------------------------
    // Course title panel
    // ------------------------------------------------------------
    const courseBoxX = 145;
    const courseBoxY = 286;
    const courseBoxWidth = width - 290;
    const courseBoxHeight = 65;

    doc
      .roundedRect(
        courseBoxX,
        courseBoxY,
        courseBoxWidth,
        courseBoxHeight,
        8
      )
      .fillColor(LIGHT)
      .fill();

    doc
      .roundedRect(
        courseBoxX,
        courseBoxY,
        courseBoxWidth,
        courseBoxHeight,
        8
      )
      .lineWidth(1)
      .strokeColor(BORDER)
      .stroke();

    // Left accent
    doc
      .roundedRect(
        courseBoxX,
        courseBoxY,
        5,
        courseBoxHeight,
        3
      )
      .fillColor(INDIGO)
      .fill();

    doc
      .font('Helvetica-Bold')
      .fontSize(params.courseTitle.length > 65 ? 15 : 18)
      .fillColor(NAVY)
      .text(params.courseTitle, courseBoxX + 20, courseBoxY + 18, {
        width: courseBoxWidth - 40,
        align: 'center',
        lineGap: 2,
      });

    // ------------------------------------------------------------
    // Bottom information section
    // ------------------------------------------------------------

    // Issue date
    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor(MUTED)
      .text('ISSUED ON', 105, 385, {
        width: 180,
        align: 'center',
        characterSpacing: 1,
      });

    doc
      .font('Helvetica-Bold')
      .fontSize(10)
      .fillColor(DARK)
      .text(params.issuedAt.toDateString(), 105, 400, {
        width: 180,
        align: 'center',
      });

    // Certificate ID
    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor(MUTED)
      .text('CERTIFICATE ID', 330, 385, {
        width: 180,
        align: 'center',
        characterSpacing: 1,
      });

    doc
      .font('Helvetica-Bold')
      .fontSize(10)
      .fillColor(INDIGO_DARK)
      .text(params.certificateCode, 330, 400, {
        width: 180,
        align: 'center',
      });

    // Credential status
    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor(MUTED)
      .text('CREDENTIAL STATUS', 555, 385, {
        width: 180,
        align: 'center',
        characterSpacing: 1,
      });

    doc
      .font('Helvetica-Bold')
      .fontSize(10)
      .fillColor('#16A34A')
      .text('VERIFIED CREDENTIAL', 555, 400, {
        width: 180,
        align: 'center',
      });

    // Vertical separators
    doc
      .lineWidth(1)
      .strokeColor(BORDER)
      .moveTo(315, 380)
      .lineTo(315, 420)
      .stroke();

    doc
      .moveTo(540, 380)
      .lineTo(540, 420)
      .stroke();

    // ------------------------------------------------------------
    // QR verification section
    // ------------------------------------------------------------
    const qrSize = 82;
    const qrX = width - 145;
    const qrY = height - 142;

    // QR white card
    doc
      .roundedRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 6)
      .fillColor('#FFFFFF')
      .fill();

    doc
      .roundedRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 6)
      .lineWidth(1)
      .strokeColor(BORDER)
      .stroke();

    doc.image(params.qrCodeBuffer, qrX, qrY, {
      width: qrSize,
      height: qrSize,
    });

    doc
      .font('Helvetica-Bold')
      .fontSize(7)
      .fillColor(NAVY)
      .text('SCAN TO VERIFY', qrX - 10, qrY + qrSize + 12, {
        width: qrSize + 20,
        align: 'center',
        characterSpacing: 0.8,
      });

    // ------------------------------------------------------------
    // Bottom branding
    // ------------------------------------------------------------
    doc
      .font('Helvetica')
      .fontSize(7)
      .fillColor(MUTED)
      .text(
        'This credential can be independently verified through LearnStack.',
        60,
        height - 68,
        {
          width: 470,
          align: 'left',
        }
      );

    doc
      .font('Helvetica-Bold')
      .fontSize(8)
      .fillColor(INDIGO)
      .text('learnstack', 60, height - 51);

    doc
      .font('Helvetica')
      .fontSize(7)
      .fillColor(MUTED)
      .text('Learning. Building. Growing.', 125, height - 50);

    // ------------------------------------------------------------
    // Small decorative dots
    // ------------------------------------------------------------
    doc.circle(510, height - 55, 2).fillColor(INDIGO).fill();
    doc.circle(522, height - 55, 2).fillColor(TEAL).fill();
    doc.circle(534, height - 55, 2).fillColor('#CBD5E1').fill();

    // ------------------------------------------------------------
    // IMPORTANT: explicitly stay on one page
    // ------------------------------------------------------------
    doc.end();
  });
};