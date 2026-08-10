import { Typography, Button, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import QrCode2OutlinedIcon from '@mui/icons-material/QrCode2Outlined';
import ArrowOutwardOutlinedIcon from '@mui/icons-material/ArrowOutwardOutlined';
import { CertificateListItem } from '../certificate.types';

const CertificateCard = ({
  certificate,
}: {
  certificate: CertificateListItem;
}) => {
  const issuedDate = new Date(certificate.issuedAt).toLocaleDateString(
    undefined,
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{
        type: 'spring',
        stiffness: 280,
        damping: 22,
      }}
      className="group relative overflow-hidden rounded-xl"
      style={{
        border: '1px solid rgba(129, 140, 248, 0.16)',
        background:
          'linear-gradient(145deg, rgba(255,255,255,0.035), rgba(255,255,255,0.012))',
        boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
      }}
    >
      {/* Animated accent line */}
      <motion.div
        className="absolute left-0 right-0 top-0 h-px"
        initial={{ opacity: 0.35 }}
        whileHover={{ opacity: 1 }}
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(129,140,248,0.9), rgba(45,212,191,0.8), transparent)',
        }}
      />

      {/* Certificate preview */}
      <div
        className="relative aspect-[16/9] overflow-hidden"
        style={{
          background:
            'radial-gradient(circle at 50% 35%, rgba(99,102,241,0.13), transparent 48%), #11161d',
        }}
      >
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Animated shine */}
        <motion.div
          className="absolute inset-y-0 pointer-events-none"
          initial={{ x: '-120%' }}
          whileHover={{ x: '160%' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{
            width: '55%',
            transform: 'skewX(-18deg)',
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
          }}
        />

        {/* Top status */}
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <Chip
            icon={
              <VerifiedOutlinedIcon
                sx={{ fontSize: 14, color: '#4ade80 !important' }}
              />
            }
            label="Verified"
            size="small"
            sx={{
              height: 25,
              fontSize: '0.7rem',
              fontWeight: 600,
              backgroundColor: 'rgba(74,222,128,0.08)',
              color: '#86efac',
              border: '1px solid rgba(74,222,128,0.16)',
              '& .MuiChip-icon': {
                marginLeft: '6px',
              },
            }}
          />
        </div>

        {/* Main certificate emblem */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 2 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16 }}
            className="relative flex h-24 w-24 items-center justify-center rounded-full"
            style={{
              border: '1px solid rgba(129,140,248,0.28)',
              background:
                'radial-gradient(circle, rgba(99,102,241,0.16), rgba(99,102,241,0.03))',
              boxShadow:
                '0 0 0 8px rgba(99,102,241,0.025), 0 0 45px rgba(99,102,241,0.14)',
            }}
          >
            <WorkspacePremiumOutlinedIcon
              sx={{
                fontSize: 48,
                color: 'primary.main',
                opacity: 0.9,
              }}
            />

            <VerifiedOutlinedIcon
              sx={{
                position: 'absolute',
                right: -3,
                bottom: 7,
                fontSize: 22,
                color: '#4ade80',
                backgroundColor: '#11161d',
                borderRadius: '50%',
              }}
            />
          </motion.div>
        </div>

        {/* Certificate label */}
        <div className="absolute bottom-4 left-4">
          <Typography
            sx={{
              fontSize: '0.65rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'monospace',
            }}
          >
            LearnStack Credential
          </Typography>
        </div>

        {/* QR */}
        {certificate.qrCodeUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute bottom-3 right-3 flex items-center justify-center rounded-lg p-1.5"
            style={{
              background: 'rgba(255,255,255,0.96)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
            }}
          >
            <img
              src={certificate.qrCodeUrl}
              alt="Certificate verification QR code"
              style={{
                width: 54,
                height: 54,
                display: 'block',
              }}
            />

            <div
              className="absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center rounded-full"
              style={{
                background: '#11161d',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <QrCode2OutlinedIcon
                sx={{
                  fontSize: 12,
                  color: 'primary.main',
                }}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Card information */}
      <div className="flex flex-col gap-3 p-5">
        <div>
          <Typography
            sx={{
              fontSize: '1rem',
              fontWeight: 650,
              lineHeight: 1.35,
              letterSpacing: '-0.01em',
            }}
          >
            {certificate.course.title}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 0.8,
              color: 'text.secondary',
            }}
          >
            Certificate of course completion
          </Typography>
        </div>

        {/* Certificate metadata */}
        <div
          className="flex items-center justify-between rounded-lg px-3 py-2.5"
          style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div>
            <Typography
              sx={{
                fontSize: '0.62rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'text.secondary',
              }}
            >
              Certificate ID
            </Typography>

            <Typography
              className="font-mono-ui"
              sx={{
                mt: 0.3,
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'primary.main',
              }}
            >
              {certificate.certificateCode}
            </Typography>
          </div>

          <div className="text-right">
            <Typography
              sx={{
                fontSize: '0.62rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'text.secondary',
              }}
            >
              Issued
            </Typography>

            <Typography
              sx={{
                mt: 0.3,
                fontSize: '0.72rem',
                fontWeight: 500,
              }}
            >
              {issuedDate}
            </Typography>
          </div>
        </div>

        {/* Actions */}
        {certificate.pdfUrl && (
          <motion.div
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2"
          >
            <Button
              component="a"
              href={certificate.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              fullWidth
              size="small"
              variant="contained"
              disableElevation
              startIcon={<DownloadOutlinedIcon fontSize="small" />}
              endIcon={
                <ArrowOutwardOutlinedIcon
                  sx={{
                    fontSize: '15px !important',
                    opacity: 0.7,
                  }}
                />
              }
              sx={{
                height: 38,
                fontSize: '0.78rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '8px',
                background:
                  'linear-gradient(135deg, rgba(99,102,241,0.95), rgba(79,70,229,0.95))',
                '&:hover': {
                  background:
                    'linear-gradient(135deg, rgba(129,140,248,1), rgba(99,102,241,1))',
                  boxShadow: '0 8px 24px rgba(99,102,241,0.2)',
                },
              }}
            >
              Download Certificate
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CertificateCard;