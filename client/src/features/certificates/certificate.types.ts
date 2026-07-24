export interface CertificateListItem {
  id: string;
  certificateCode: string;
  qrCodeUrl: string | null;
  pdfUrl: string | null;
  issuedAt: string;
  course: { id: string; title: string; thumbnailUrl: string | null };
}

export interface CertificateVerifyResult {
  id: string;
  certificateCode: string;
  issuedAt: string;
  user: { id: string; name: string };
  course: { id: string; title: string };
}