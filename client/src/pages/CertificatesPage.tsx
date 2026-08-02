import { Typography, CircularProgress } from '@mui/material';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import { useMyCertificates } from '@/features/certificates/certificatesApi';
import CertificateCard from '@/features/certificates/components/CertificateCard';
import EmptyState from '@/components/ui/EmptyState';

const CertificatesPage = () => {
  const { data: certificates, isLoading } = useMyCertificates();

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-1">
        <div
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{
            width: 38,
            height: 38,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(99,102,241,0.08))',
            border: '1px solid rgba(99,102,241,0.4)',
          }}
        >
          <WorkspacePremiumOutlinedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
        </div>
        <Typography variant="overline" color="primary.main" className="font-mono-ui">
          $ certificates --my
        </Typography>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700 }}>
          Your certificates
        </Typography>
        {!isLoading && certificates && certificates.length > 0 && (
          <span
            className="font-mono-ui"
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: 999,
              background: 'rgba(99,102,241,0.12)',
              color: '#818cf8',
              border: '1px solid rgba(99,102,241,0.3)',
            }}
          >
            {certificates.length} earned
          </span>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <CircularProgress />
        </div>
      )}

      {!isLoading && certificates && certificates.length === 0 && (
        <EmptyState title="No certificates yet" description="Complete a course to earn your first certificate." />
      )}

      {!isLoading && certificates && certificates.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <CertificateCard key={cert.id} certificate={cert} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificatesPage;