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
    <div className="flex flex-col h-full" style={{ background: 'rgba(255,255,255,0.02)' }}>
      {progress && (
        <div
          className="p-4"
          style={{
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(99,102,241,0.04)',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Progress</Typography>
            <Typography variant="body2" className="font-mono-ui" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {progress.percentComplete}%
            </Typography>
          </div>
          <LinearProgress
            variant="determinate"
            value={progress.percentComplete}
            sx={{
              height: 5,
              borderRadius: 3,
              bgcolor: 'rgba(255,255,255,0.08)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                background: 'linear-gradient(90deg, rgba(99,102,241,0.8), rgba(99,102,241,1))',
              },
            }}
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {chapters
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((chapter) => (
            <div key={chapter.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, p: 2, pb: 1, color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', letterSpacing: 0.5, textTransform: 'uppercase' }}
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
                        className="flex items-center gap-2 px-4 py-2 no-underline text-inherit transition-colors"
                        style={{
                          backgroundColor: isActive ? 'rgba(99,102,241,0.1)' : 'transparent',
                          borderLeft: isActive ? '3px solid rgba(99,102,241,0.8)' : '3px solid transparent',
                          color: isActive ? '#818cf8' : undefined,
                        }}
                      >
                        {isCompleted ? (
                          <CheckCircleIcon sx={{ fontSize: 16, color: '#4ade80' }} />
                        ) : (
                          <span style={{ color: isActive ? '#818cf8' : 'rgba(255,255,255,0.5)', display: 'flex' }}>
                            {lessonIcon(lesson.type)}
                          </span>
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