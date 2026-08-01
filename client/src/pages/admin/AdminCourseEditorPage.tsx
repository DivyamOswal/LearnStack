import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Chip } from '@mui/material';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import CourseForm from '@/features/admin/components/courses/CourseForm';
import ChapterManager from '@/features/admin/components/courses/ChapterManager';

const glassPanel = {
  bgcolor: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 3,
  backdropFilter: 'blur(12px)',
};

const AdminCourseEditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // "new" is a placeholder route param meaning "create mode" no real course yet
  const [createdCourseId, setCreatedCourseId] = useState<string | null>(id !== 'new' ? id ?? null : null);

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
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
          <SchoolOutlinedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
        </div>
        <Typography variant="overline" color="primary.main" className="font-mono-ui">
          $ course --edit
        </Typography>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700 }}>
          {createdCourseId ? 'Edit course' : 'Create a new course'}
        </Typography>
        <Chip
          label={createdCourseId ? 'editing' : 'draft'}
          size="small"
          className="font-mono-ui"
          sx={{
            bgcolor: createdCourseId ? 'rgba(34,197,94,0.12)' : 'rgba(251,191,36,0.12)',
            color: createdCourseId ? '#4ade80' : '#fbbf24',
            border: `1px solid ${createdCourseId ? 'rgba(34,197,94,0.3)' : 'rgba(251,191,36,0.3)'}`,
            fontWeight: 600,
          }}
        />
      </div>

      <div style={glassPanel} className="p-5 md:p-8">
        {!createdCourseId ? (
          <CourseForm
            onSuccess={(courseId) => {
              setCreatedCourseId(courseId);
              navigate(`/admin/courses/${courseId}`, { replace: true });
            }}
          />
        ) : (
          <div className="flex flex-col gap-10">
            <ChapterManager courseId={createdCourseId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCourseEditorPage;