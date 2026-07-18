export interface GenerateCertificateInput {
  courseId: string;
}

export interface CertificateWithRelations {
  id: string;
  certificateCode: string;
  qrCodeUrl: string | null;
  pdfUrl: string | null;
  issuedAt: Date;
  user: { id: string; name: string };
  course: { id: string; title: string };
}