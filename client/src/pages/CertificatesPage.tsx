import { Typography, CircularProgress } from '@mui/material';
import { useMyCertificates } from '@/features/certificates/certificatesApi';
import CertificateCard from '@/features/certificates/components/CertificateCard';
import EmptyState from '@/components/ui/EmptyState';

const CertificatesPage = () => {
  const { data: certificates, isLoading } = useMyCertificates();

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <Typography variant="overline" color="primary.main">
        $ certificates --my
      </Typography>
      <Typography variant="h4" sx={{ mt: 1, mb: 6, fontSize: { xs: '1.5rem', md: '2rem' } }}>
        Your certificates
      </Typography>

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