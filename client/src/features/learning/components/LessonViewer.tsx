import { Typography } from '@mui/material';
import { LessonDetail } from '../learning.types';

const LessonViewer = ({ lesson }: { lesson: LessonDetail }) => {
  return (
    <div className="flex flex-col gap-6">
      <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700 }}>
        {lesson.title}
      </Typography>

      {lesson.type === 'VIDEO' && lesson.videoUrl && (
        <video
          controls
          className="w-full rounded-lg aspect-video"
          src={lesson.videoUrl}
          style={{ border: '1px solid rgba(255,255,255,0.08)' }}
        />
      )}

      {(lesson.type === 'ARTICLE' || lesson.type === 'MARKDOWN') && lesson.content && (
        <div className="prose max-w-none" style={{ whiteSpace: 'pre-wrap' }}>
          <Typography component="div">{lesson.content}</Typography>
        </div>
      )}

      {lesson.type === 'CODE_SNIPPET' && lesson.content && (
        <pre
          className="font-mono-ui text-sm p-4 rounded-lg overflow-x-auto"
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <code>{lesson.content}</code>
        </pre>
      )}

      {lesson.pdfUrl && (
        
          <a href={lesson.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono-ui text-sm no-underline inline-flex items-center gap-2 w-fit px-3 py-2 rounded-lg transition-colors"
          style={{
            color: '#818cf8',
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.25)',
          }}
        >
          Download attached PDF →
        </a>
      )}

      {lesson.topics.length > 0 && (
        <div className="flex flex-col gap-4 mt-4">
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Topics</Typography>
          {lesson.topics
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((topic) => (
              <div
                key={topic.id}
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <Typography sx={{ fontWeight: 700, mb: 1 }}>{topic.title}</Typography>
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