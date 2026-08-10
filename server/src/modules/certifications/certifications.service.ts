import { v4 as uuidv4 } from 'uuid';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { ApiError } from '../../utils/ApiError';
import { env } from '../../config/env';
import { uploadBufferToImageKit } from '../../utils/imagekit.helper';
import prisma from '../../config/db';
import * as certificateRepo from './certifications.repository';

const generateCertificateCode = () => {
  return `CERT-${uuidv4().split('-')[0].toUpperCase()}`;
};

const generateQrCodeBuffer = async (verifyUrl: string): Promise<Buffer> => {
  return QRCode.toBuffer(verifyUrl, { width: 300, margin: 1 });
};

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
    });

    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const { width, height } = doc.page;

    // ---------------------------------------------------------
    // LearnStack colors
    // ---------------------------------------------------------
    const navy = '#0F172A';
    const indigo = '#6366F1';
    const indigoLight = '#818CF8';
    const teal = '#2DD4BF';
    const green = '#4ADE80';
    const white = '#FFFFFF';
    const muted = '#64748B';
    const lightBg = '#F8FAFC';

    // ---------------------------------------------------------
    // Background
    // ---------------------------------------------------------
    doc.rect(0, 0, width, height).fill(lightBg);

    // ---------------------------------------------------------
    // Main certificate frame
    // ---------------------------------------------------------
    doc
      .rect(18, 18, width - 36, height - 36)
      .lineWidth(3)
      .stroke(navy);

    doc
      .rect(30, 30, width - 60, height - 60)
      .lineWidth(1)
      .stroke(indigo);

    // ---------------------------------------------------------
    // Decorative corners
    // ---------------------------------------------------------

    // Top left
    doc
      .moveTo(30, 75)
      .lineTo(30, 30)
      .lineTo(75, 30)
      .lineWidth(4)
      .stroke(teal);

    // Top right
    doc
      .moveTo(width - 75, 30)
      .lineTo(width - 30, 30)
      .lineTo(width - 30, 75)
      .lineWidth(4)
      .stroke(teal);

    // Bottom left
    doc
      .moveTo(30, height - 75)
      .lineTo(30, height - 30)
      .lineTo(75, height - 30)
      .lineWidth(4)
      .stroke(indigo);

    // Bottom right
    doc
      .moveTo(width - 75, height - 30)
      .lineTo(width - 30, height - 30)
      .lineTo(width - 30, height - 75)
      .lineWidth(4)
      .stroke(indigo);

    // ---------------------------------------------------------
    // LearnStack branding
    // ---------------------------------------------------------

    doc
      .font('Helvetica-Bold')
      .fontSize(12)
      .fillColor(indigo)
      .text('LEARNSTACK', 55, 55, {
        characterSpacing: 2,
      });

    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor(muted)
      .text('LEARN • BUILD • MASTER', 55, 72, {
        characterSpacing: 1,
      });

    // ---------------------------------------------------------
    // Certificate heading
    // ---------------------------------------------------------

    doc
      .font('Helvetica-Bold')
      .fontSize(32)
      .fillColor(navy)
      .text('CERTIFICATE', 0, 105, {
        align: 'center',
      });

    doc
      .font('Helvetica-Bold')
      .fontSize(17)
      .fillColor(indigo)
      .text('OF COMPLETION', 0, 143, {
        align: 'center',
        characterSpacing: 2,
      });

    // Accent line
    doc
      .moveTo(width / 2 - 70, 177)
      .lineTo(width / 2 + 70, 177)
      .lineWidth(2)
      .stroke(teal);

    // Center diamond
    doc
      .moveTo(width / 2, 171)
      .lineTo(width / 2 + 6, 177)
      .lineTo(width / 2, 183)
      .lineTo(width / 2 - 6, 177)
      .closePath()
      .fill(indigo);

    // ---------------------------------------------------------
    // Intro
    // ---------------------------------------------------------

    doc
      .font('Helvetica')
      .fontSize(12)
      .fillColor(muted)
      .text('This certifies that', 0, 198, {
        align: 'center',
      });

    // ---------------------------------------------------------
    // Student name
    // ---------------------------------------------------------

    doc
      .font('Helvetica-Bold')
      .fontSize(27)
      .fillColor(navy)
      .text(params.studentName, 100, 225, {
        width: width - 200,
        align: 'center',
      });

    doc
      .moveTo(width / 2 - 150, 262)
      .lineTo(width / 2 + 150, 262)
      .lineWidth(1)
      .stroke(indigo);

    // ---------------------------------------------------------
    // Completion text
    // ---------------------------------------------------------

    doc
      .font('Helvetica')
      .fontSize(12)
      .fillColor(muted)
      .text('has successfully completed the course', 0, 280, {
        align: 'center',
      });

    // ---------------------------------------------------------
    // Course title
    // ---------------------------------------------------------

    doc
      .font('Helvetica-Bold')
      .fontSize(18)
      .fillColor(indigo)
      .text(params.courseTitle, 100, 307, {
        width: width - 200,
        align: 'center',
        lineGap: 3,
      });

    // ---------------------------------------------------------
    // Information section
    // ---------------------------------------------------------

    const infoY = 385;

    // Issued date
    doc
      .font('Helvetica-Bold')
      .fontSize(8)
      .fillColor(muted)
      .text('ISSUED ON', 85, infoY);

    doc
      .font('Helvetica')
      .fontSize(11)
      .fillColor(navy)
      .text(params.issuedAt.toDateString(), 85, infoY + 15);

    // Certificate ID
    doc
      .font('Helvetica-Bold')
      .fontSize(8)
      .fillColor(muted)
      .text('CERTIFICATE ID', width / 2 - 60, infoY, {
        width: 120,
        align: 'center',
      });

    doc
      .font('Helvetica-Bold')
      .fontSize(10)
      .fillColor(indigo)
      .text(params.certificateCode, width / 2 - 80, infoY + 15, {
        width: 160,
        align: 'center',
      });

    // ---------------------------------------------------------
    // Verified badge
    // ---------------------------------------------------------

    doc
      .roundedRect(width - 245, infoY - 8, 105, 38, 19)
      .fillAndStroke('#ECFDF5', green);

    doc
      .circle(width - 225, infoY + 11, 7)
      .fill(green);

    doc
      .font('Helvetica-Bold')
      .fontSize(8)
      .fillColor('#166534')
      .text('VERIFIED', width - 211, infoY + 6);

    // ---------------------------------------------------------
    // QR Code
    // ---------------------------------------------------------

    const qrSize = 82;

    const qrX = width - 145;
    const qrY = height - 125;

    doc
      .roundedRect(
        qrX - 8,
        qrY - 8,
        qrSize + 16,
        qrSize + 16,
        6
      )
      .fill(white);

    doc
      .roundedRect(
        qrX - 8,
        qrY - 8,
        qrSize + 16,
        qrSize + 16,
        6
      )
      .lineWidth(1)
      .stroke('#CBD5E1');

    doc.image(params.qrCodeBuffer, qrX, qrY, {
      width: qrSize,
      height: qrSize,
    });

    doc
      .font('Helvetica')
      .fontSize(7)
      .fillColor(muted)
      .text('SCAN TO VERIFY', qrX - 10, qrY + qrSize + 14, {
        width: qrSize + 20,
        align: 'center',
        characterSpacing: 1,
      });

    // ---------------------------------------------------------
    // Footer
    // ---------------------------------------------------------

    doc
      .font('Helvetica')
      .fontSize(7)
      .fillColor(muted)
      .text(
        'This credential is digitally verifiable through LearnStack.',
        55,
        height - 58
      );

    doc
      .font('Helvetica-Bold')
      .fontSize(8)
      .fillColor(indigo)
      .text('LEARNSTACK', 55, height - 43, {
        characterSpacing: 1.5,
      });

    doc.end();
  });
};

export const generateCertificate = async (userId: string, courseId: string) => {
  const [user, course] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true } }),
    certificateRepo.findCourseById(courseId),
  ]);

  if (!user) throw new ApiError(404, 'User not found.');
  if (!course) throw new ApiError(404, 'Course not found.');

  const existing = await certificateRepo.findExistingCertificate(userId, courseId);
  if (existing) {
    throw new ApiError(409, 'A certificate has already been issued for this course.');
  }

  const totalLessons = await certificateRepo.countLessonsInCourse(courseId);
  if (totalLessons === 0) {
    throw new ApiError(400, 'This course has no lessons yet, so it cannot be completed.');
  }

  const completedLessons = await certificateRepo.countCompletedLessonsForUser(userId, courseId);
  if (completedLessons < totalLessons) {
    throw new ApiError(
      400,
      `Course not yet complete. ${completedLessons}/${totalLessons} lessons finished.`
    );
  }

  const certificateCode = generateCertificateCode();
  const verifyUrl = `${env.CLIENT_URL}/verify-certificate/${certificateCode}`;
  const issuedAt = new Date();

  const qrCodeBuffer = await generateQrCodeBuffer(verifyUrl);
  const qrCodeUrl = await uploadBufferToImageKit(
    qrCodeBuffer,
    `qr-${certificateCode}.png`,
    'learnstack/qrcodes'
  );

  const pdfBuffer = await generateCertificatePdfBuffer({
    studentName: user.name,
    courseTitle: course.title,
    certificateCode,
    issuedAt,
    qrCodeBuffer,
  });

  const pdfUrl = await uploadBufferToImageKit(
    pdfBuffer,
    `certificate-${certificateCode}.pdf`,
    'learnstack/certificates'
  );

  return certificateRepo.createCertificate({
    userId,
    courseId,
    certificateCode,
    qrCodeUrl,
    pdfUrl,
  });
};

export const getMyCertificates = async (userId: string) => {
  return certificateRepo.findCertificatesForUser(userId);
};

export const verifyCertificateByCode = async (code: string) => {
  const certificate = await certificateRepo.findCertificateByCode(code);
  if (!certificate) {
    throw new ApiError(404, 'No certificate found with this code. It may be invalid or revoked.');
  }
  return certificate;
};

export const getCertificateForDownload = async (id: string, userId: string) => {
  const certificate = await certificateRepo.findCertificateById(id);
  if (!certificate) throw new ApiError(404, 'Certificate not found.');
  if (certificate.user.id !== userId) {
    throw new ApiError(403, 'You do not have permission to access this certificate.');
  }
  return certificate;
};

export const getAllCertificatesForAdmin = async () => {
  return certificateRepo.findAllCertificatesForAdmin();
};
