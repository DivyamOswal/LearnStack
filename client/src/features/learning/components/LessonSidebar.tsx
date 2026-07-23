import { Link as RouterLink } from 'react-router-dom';
import { Typography, LinearProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { SidebarChapter, LessonType } from '../learning.types';
import { ProgressSummary } from '../learning.types';

const lessonIcon = (type: LessonType) => {
  switch (type) {
    case 'VIDEO': return <PlayCircleOutlinedIcon sx={{ fontSize: 16 }} />;
    case 'ARTICLE': return <ArticleOutlinedIcon sx={{ fontSize: 16 }} />;
    case 'CODE_SNIPPET': return <CodeOutlinedIcon sx={{ fontSize: 16 }} />;
    default: return <DescriptionOutlinedIcon sx={{ fontSize: 16 }} />;
  }
};

interface LessonSidebarProps {
  chapters: SidebarChapter[];
  activeLessonId: string;
  completedLessonIds: Set<string>;
  progress?: ProgressSummary;
}

const LessonSidebar = ({ chapters, activeLessonId, completedLessonIds, progress }: LessonSidebarProps) => {
  return (
    <div className="flex flex-col h-full">
      {progress && (
        <div className="p-4 border-b" style={{ borderColor: 'inherit' }}>
          <div className="flex items-center justify-between mb-2">
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Progress</Typography>
            <Typography variant="body2" className="font-mono-ui" color="primary.main">
              {progress.percentComplete}%
            </Typography>
          </div>
          <LinearProgress variant="determinate" value={progress.percentComplete} sx={{ height: 5, borderRadius: 3 }} />
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {chapters
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((chapter) => (
            <div key={chapter.id} className="border-b" style={{ borderColor: 'inherit' }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, p: 2, pb: 1 }}
                className="font-mono-ui"
              >
                {chapter.title}
              </Typography>
              <div className="flex flex-col pb-2">
                {chapter.lessons
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((lesson) => {
                    const isActive = lesson.id === activeLessonId;
                    const isCompleted = completedLessonIds.has(lesson.id);
                    return (
                      <RouterLink
                        key={lesson.id}
                        to={`/learn/${lesson.id}`}
                        className="flex items-center gap-2 px-4 py-2 no-underline text-inherit"
                        style={{
                          backgroundColor: isActive ? 'var(--mui-palette-action-hover, #1c2128)' : 'transparent',
                          color: isActive ? 'var(--mui-palette-primary-main, #2DD4BF)' : undefined,
                        }}
                      >
                        {isCompleted ? (
                          <CheckCircleIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                        ) : (
                          lessonIcon(lesson.type)
                        )}
                        <Typography variant="body2" sx={{ fontWeight: isActive ? 600 : 400 }}>
                          {lesson.title}
                        </Typography>
                      </RouterLink>
                    );
                  })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default LessonSidebar;