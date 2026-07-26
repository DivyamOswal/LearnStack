import { Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { CertificateVerifyResult as VerifyResultType } from '../certificate.types';

interface CertificateVerifyResultProps {
  result: VerifyResultType | null;
  isError: boolean;
  code: string;
}

const VerifiedSeal = () => (
  <motion.svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <motion.circle
      cx="32"
      cy="32"
      r="29"
      stroke="var(--mui-palette-primary-main, #2DD4BF)"
      strokeWidth="2.5"
      initial={{ pathLength: 0, rotate: -90 }}
      animate={{ pathLength: 1, rotate: -90 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{ transformOrigin: '32px 32px' }}
    />
    <motion.path
      d="M19 32.5L28 41.5L45 22"
      stroke="var(--mui-palette-primary-main, #2DD4BF)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.45, delay: 0.5, ease: 'easeOut' }}
    />
  </motion.svg>
);

const InvalidMark = () => (
  <motion.svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <motion.circle
      cx="32"
      cy="32"
      r="29"
      stroke="var(--mui-palette-error-main, #f44336)"
      strokeWidth="2.5"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    />
    <motion.path
      d="M23 23L41 41M41 23L23 41"
      stroke="var(--mui-palette-error-main, #f44336)"
      strokeWidth="2.5"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.35, delay: 0.4, ease: 'easeOut' }}
    />
  </motion.svg>
);

const CertificateVerifyResult = ({ result, isError, code }: CertificateVerifyResultProps) => {
  if (isError || !result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col items-center gap-3 text-center py-12"
      >
        <InvalidMark />
        <Typography variant="h6" sx={{ mt: 1 }}>Certificate not found</Typography>
        <Typography color="text.secondary" className="font-mono-ui" sx={{ fontSize: '0.85rem' }}>
          {code}
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 380 }}>
          This code doesn't match any issued certificate. It may be invalid or mistyped.
        </Typography>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center gap-4 text-center py-12"
    >
      <VerifiedSeal />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.3 }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Certificate verified
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.35 }}
        className="flex flex-col gap-1 mt-2"
      >
        <Typography color="text.secondary" variant="body2">
          This certifies that
        </Typography>
        <Typography variant="h6">{result.user.name}</Typography>
        <Typography color="text.secondary" variant="body2">
          has completed
        </Typography>
        <Typography variant="h6" color="primary.main">
          {result.course.title}
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.15, duration: 0.3 }}
        className="flex flex-col gap-1 mt-4 font-mono-ui text-sm"
        style={{ color: 'inherit', opacity: 0.6 }}
      >
        <span>ID: {result.certificateCode}</span>
        <span>Issued: {new Date(result.issuedAt).toLocaleDateString()}</span>
      </motion.div>
    </motion.div>
  );
};

export default CertificateVerifyResult;