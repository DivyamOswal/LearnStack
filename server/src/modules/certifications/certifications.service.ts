import { v4 as uuidv4 } from 'uuid';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { ApiError } from '../../utils/ApiError';
import { env } from '../../config/env';
import { uploadBufferToCloudinary } from '../../utils/cloudinaryUpload';
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
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const { width, height } = doc.page;

    doc.rect(20, 20, width - 40, height - 40).lineWidth(2).stroke('#1a1a2e');

    doc.fontSize(28).font('Helvetica-Bold').text('Certificate of Completion', 0, 100, { align: 'center' });
    doc.fontSize(14).font('Helvetica').text('This certifies that', 0, 160, { align: 'center' });
    doc.fontSize(26).font('Helvetica-Bold').text(params.studentName, 0, 190, { align: 'center' });
    doc.fontSize(14).font('Helvetica').text('has successfully completed the course', 0, 235, { align: 'center' });
    doc.fontSize(20).font('Helvetica-Bold').text(params.courseTitle, 0, 260, { align: 'center' });
    doc.fontSize(11).font('Helvetica').text(`Issued on ${params.issuedAt.toDateString()}`, 0, 310, { align: 'center' });
    doc.fontSize(10).text(`Certificate ID: ${params.certificateCode}`, 0, 330, { align: 'center' });

    doc.image(params.qrCodeBuffer, width - 170, height - 170, { width: 100, height: 100 });

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
  const qrCodeUrl = await uploadBufferToCloudinary(qrCodeBuffer, 'learnstack/qrcodes', 'image');

  const pdfBuffer = await generateCertificatePdfBuffer({
    studentName: user.name,
    courseTitle: course.title,
    certificateCode,
    issuedAt,
    qrCodeBuffer,
  });
  const pdfUrl = await uploadBufferToCloudinary(pdfBuffer, 'learnstack/certificates', 'raw');

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