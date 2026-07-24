import { Typography, Button } from '@mui/material';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import { CertificateListItem } from '../certificate.types';

const CertificateCard = ({ certificate }: { certificate: CertificateListItem }) => {
  return (
    <div className="border rounded-lg overflow-hidden flex flex-col" style={{ borderColor: 'inherit' }}>
      <div
        className="aspect-video flex items-center justify-center relative"
        style={{ backgroundColor: 'var(--mui-palette-action-hover, #1c2128)' }}
      >
        <VerifiedOutlinedIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.6 }} />
        {certificate.qrCodeUrl && (
          <img
            src={certificate.qrCodeUrl}
            alt="Certificate QR code"
            className="absolute bottom-2 right-2 rounded"
            style={{ width: 48, height: 48 }}
          />
        )}
      </div>

      <div className="p-4 flex flex-col gap-2">
        <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>{certificate.course.title}</Typography>
        <Typography variant="caption" color="text.secondary" className="font-mono-ui">
          {certificate.certificateCode}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Issued {new Date(certificate.issuedAt).toLocaleDateString()}
        </Typography>

        {certificate.pdfUrl && (
          <Button
            component="a"
            href={certificate.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            startIcon={<DownloadOutlinedIcon fontSize="small" />}
            variant="outlined"
            sx={{ mt: 1, alignSelf: 'flex-start' }}
          >
            Download
          </Button>
        )}
      </div>
    </div>
  );
};

export default CertificateCard;