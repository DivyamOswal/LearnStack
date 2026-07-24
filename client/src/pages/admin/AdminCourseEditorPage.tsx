import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import CourseForm from '@/features/admin/components/courses/CourseForm';
import ChapterManager from '@/features/admin/components/courses/ChapterManager';

const AdminCourseEditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // "new" is a placeholder route param meaning "create mode" no real course yet
  const [createdCourseId, setCreatedCourseId] = useState<string | null>(id !== 'new' ? id ?? null : null);

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <Typography variant="overline" color="primary.main">
        $ course --edit
      </Typography>
      <Typography variant="h4" sx={{ mt: 1, mb: 6, fontSize: { xs: '1.5rem', md: '2rem' } }}>
        {createdCourseId ? 'Edit course' : 'Create a new course'}
      </Typography>

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
  );
};

export default AdminCourseEditorPage;