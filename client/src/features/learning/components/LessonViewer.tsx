import { Typography } from '@mui/material';
import { LessonDetail } from '../learning.types';

const LessonViewer = ({ lesson }: { lesson: LessonDetail }) => {
  return (
    <div className="flex flex-col gap-6">
      <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
        {lesson.title}
      </Typography>

      {lesson.type === 'VIDEO' && lesson.videoUrl && (
        <video controls className="w-full rounded-lg aspect-video" src={lesson.videoUrl} />
      )}

      {(lesson.type === 'ARTICLE' || lesson.type === 'MARKDOWN') && lesson.content && (
        <div className="prose max-w-none" style={{ whiteSpace: 'pre-wrap' }}>
          <Typography component="div">{lesson.content}</Typography>
        </div>
      )}

      {lesson.type === 'CODE_SNIPPET' && lesson.content && (
        <pre
          className="font-mono-ui text-sm p-4 rounded-lg overflow-x-auto"
          style={{ backgroundColor: 'var(--mui-palette-action-hover, #1c2128)' }}
        >
          <code>{lesson.content}</code>
        </pre>
      )}

      {lesson.pdfUrl && (
        
          <a href={lesson.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono-ui text-sm underline"
          style={{ color: 'var(--mui-palette-primary-main, #2DD4BF)' }}
        >
          Download attached PDF →
        </a>
      )}

      {lesson.topics.length > 0 && (
        <div className="flex flex-col gap-4 mt-4">
          <Typography variant="h6">Topics</Typography>
          {lesson.topics
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((topic) => (
              <div key={topic.id} className="p-4 border rounded-md" style={{ borderColor: 'inherit' }}>
                <Typography sx={{ fontWeight: 600, mb: 1 }}>{topic.title}</Typography>
                <Typography variant="body2" color="text.secondary" style={{ whiteSpace: 'pre-wrap' }}>
                  {topic.content}
                </Typography>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default LessonViewer;