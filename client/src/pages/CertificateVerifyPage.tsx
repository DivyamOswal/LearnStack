import { useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { useVerifyCertificate } from '@/features/certificates/certificatesApi';
import CertificateVerifyResult from '@/features/certificates/components/CertificateVerifyResult';

const CertificateVerifyPage = () => {
  const { code } = useParams<{ code: string }>();
  const { data, isLoading, isError } = useVerifyCertificate(code ?? '');

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4">
      <CertificateVerifyResult result={data ?? null} isError={isError} code={code ?? ''} />
    </div>
  );
};

export default CertificateVerifyPage;