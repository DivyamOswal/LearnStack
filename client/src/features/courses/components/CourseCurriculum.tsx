import { Accordion, AccordionSummary, AccordionDetails, Typography, Chip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { ChapterSummary, LessonSummary } from '../course.types';

const lessonIcon = (type: LessonSummary['type']) => {
  switch (type) {
    case 'VIDEO':
      return <PlayCircleOutlinedIcon sx={{ fontSize: 18, color: 'primary.main' }} />;
    case 'ARTICLE':
      return <ArticleOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />;
    case 'CODE_SNIPPET':
      return <CodeOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />;
    default:
      return <DescriptionOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />;
  }
};

const CourseCurriculum = ({ chapters }: { chapters: ChapterSummary[] }) => {
  const totalLessons = chapters.reduce((sum, c) => sum + c.lessons.length, 0);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-4">
        <Typography variant="h5">Curriculum</Typography>
        <Typography variant="body2" color="text.secondary" className="font-mono-ui">
          {chapters.length} chapters · {totalLessons} lessons
        </Typography>
      </div>

      {chapters
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((chapter, index) => (
          <Accordion
            key={chapter.id}
            disableGutters
            elevation={0}
            sx={{ border: '1px solid', borderColor: 'divider', '&:before': { display: 'none' }, mb: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <div className="flex items-center gap-3 w-full">
                <Typography className="font-mono-ui" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                  {String(index + 1).padStart(2, '0')}
                </Typography>
                <Typography sx={{ fontWeight: 600, flexGrow: 1 }}>{chapter.title}</Typography>
                <Chip
                  label={`${chapter.lessons.length} lessons`}
                  size="small"
                  className="font-mono-ui"
                  sx={{ bgcolor: 'action.hover', fontSize: '0.7rem' }}
                />
              </div>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
              <div className="flex flex-col gap-2">
                {chapter.lessons
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((lesson) => (
                    <div key={lesson.id} className="flex items-center gap-2 py-1.5 pl-8">
                      {lessonIcon(lesson.type)}
                      <Typography variant="body2">{lesson.title}</Typography>
                    </div>
                  ))}
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
    </div>
  );
};

export default CourseCurriculum;