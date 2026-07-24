import { Typography } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { CertificateVerifyResult as VerifyResultType } from '../certificate.types';

interface CertificateVerifyResultProps {
  result: VerifyResultType | null;
  isError: boolean;
  code: string;
}

const CertificateVerifyResult = ({ result, isError, code }: CertificateVerifyResultProps) => {
  if (isError || !result) {
    return (
      <div className="flex flex-col items-center gap-3 text-center py-12">
        <CancelOutlinedIcon sx={{ fontSize: 56, color: 'error.main' }} />
        <Typography variant="h6">Certificate not found</Typography>
        <Typography color="text.secondary" className="font-mono-ui" sx={{ fontSize: '0.85rem' }}>
          {code}
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 380 }}>
          This code doesn't match any issued certificate. It may be invalid or mistyped.
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 text-center py-12">
      <VerifiedIcon sx={{ fontSize: 56, color: 'primary.main' }} />
      <Typography variant="h5" sx={{ fontWeight: 700 }}>Certificate verified</Typography>

      <div className="flex flex-col gap-1 mt-2">
        <Typography color="text.secondary" variant="body2">This certifies that</Typography>
        <Typography variant="h6">{result.user.name}</Typography>
        <Typography color="text.secondary" variant="body2">has completed</Typography>
        <Typography variant="h6" color="primary.main">{result.course.title}</Typography>
      </div>

      <div className="flex flex-col gap-1 mt-4 font-mono-ui text-sm" style={{ color: 'inherit', opacity: 0.6 }}>
        <span>ID: {result.certificateCode}</span>
        <span>Issued: {new Date(result.issuedAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default CertificateVerifyResult;