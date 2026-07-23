import { useParams } from 'react-router-dom';
import { CircularProgress, Drawer, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import {
  useLessonDetail,
  useChaptersForCourse,
  useCourseProgress,
  useDetailedProgress,
} from '@/features/learning/learningApi';
import LessonViewer from '@/features/learning/components/LessonViewer';
import LessonSidebar from '@/features/learning/components/LessonSidebar';
import MarkCompleteButton from '@/features/learning/components/MarkCompleteButton';
import CommentThread from '@/features/comments/components/CommentThread';
import EmptyState from '@/components/ui/EmptyState';

const LessonPage = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const { data: lesson, isLoading: lessonLoading, isError } = useLessonDetail(lessonId ?? '');
  const courseId = lesson?.chapter.courseId ?? '';

  const { data: chapters } = useChaptersForCourse(courseId);
  const { data: progress } = useCourseProgress(courseId);
  const { data: detailedProgress } = useDetailedProgress(courseId);

  if (lessonLoading) {
    return (
      <div className="flex justify-center py-24">
        <CircularProgress />
      </div>
    );
  }

  if (isError || !lesson) {
    return <EmptyState title="Lesson not found" description="This lesson may have been removed or you may not have access." />;
  }

  // NOTE: real purchase-gating isn't enforced by the backend yet (flagged back
  // in the lessons module) — this page will render for any authenticated user.
  const completedLessonIds = new Set<string>(
    (detailedProgress ?? []).filter((p) => p.completed).map((p) => p.lessonId)
  );

  const sidebarContent = chapters && (
    <LessonSidebar
      chapters={chapters}
      activeLessonId={lesson.id}
      completedLessonIds={completedLessonIds}
      progress={progress}
    />
  );

  return (
    <div className="flex" style={{ height: 'calc(100vh - 65px)' }}>
      {!isMobile && (
        <div className="w-72 shrink-0 border-r overflow-y-auto" style={{ borderColor: 'inherit' }}>
          {sidebarContent}
        </div>
      )}

      {isMobile && (
        <Drawer anchor="left" open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} PaperProps={{ sx: { width: 280 } }}>
          {sidebarContent}
        </Drawer>
      )}

      <div className="flex-1 overflow-y-auto p-6 md:p-10 max-w-3xl mx-auto w-full">
        {isMobile && (
          <IconButton onClick={() => setMobileNavOpen(true)} sx={{ mb: 2 }}>
            <MenuIcon />
          </IconButton>
        )}

        <LessonViewer lesson={lesson} />

        <div className="mt-8">
          <MarkCompleteButton lessonId={lesson.id} isCompleted={completedLessonIds.has(lesson.id)} />
        </div>

        <CommentThread lessonId={lesson.id} />
      </div>
    </div>
  );
};

export default LessonPage;