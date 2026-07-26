import { Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import { CertificateListItem } from '../certificate.types';

const CertificateCard = ({ certificate }: { certificate: CertificateListItem }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="border rounded-lg overflow-hidden flex flex-col"
      style={{ borderColor: 'inherit' }}
    >
      <div
        className="aspect-video flex items-center justify-center relative overflow-hidden group"
        style={{ backgroundColor: 'var(--mui-palette-action-hover, #1c2128)' }}
      >
        {/* Faint diagonal shine sweep on hover — evokes a foil/seal effect without any gradient in the resting state */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ x: '-120%' }}
          whileHover={{ x: '120%' }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          style={{
            background: 'linear-gradient(115deg, transparent 40%, rgba(45,212,191,0.18) 50%, transparent 60%)',
            width: '60%',
          }}
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <VerifiedOutlinedIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.7 }} />
        </motion.div>

        {certificate.qrCodeUrl && (
          <motion.img
            src={certificate.qrCodeUrl}
            alt="Certificate QR code"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.15 }}
            className="absolute bottom-2 right-2 rounded"
            style={{ width: 48, height: 48, border: '2px solid var(--mui-palette-background-paper, #161B22)' }}
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
          <motion.div whileTap={{ scale: 0.96 }} style={{ alignSelf: 'flex-start' }}>
            <Button
              component="a"
              href={certificate.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              startIcon={<DownloadOutlinedIcon fontSize="small" />}
              variant="outlined"
              sx={{
                mt: 1,
                transition: 'border-color 0.15s ease, color 0.15s ease',
                '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
              }}
            >
              Download
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CertificateCard;