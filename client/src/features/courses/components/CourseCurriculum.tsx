import { Accordion, AccordionSummary, AccordionDetails, Typography, Chip, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { ChapterSummary, LessonSummary } from '../course.types';

const lessonIcon = (type: LessonSummary['type']) => {
  switch (type) {
    case 'VIDEO':
      return <PlayCircleOutlinedIcon sx={{ fontSize: 16, color: 'primary.main' }} />;
    case 'ARTICLE':
      return <ArticleOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />;
    case 'CODE_SNIPPET':
      return <CodeOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />;
    default:
      return <DescriptionOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />;
  }
};

const CourseCurriculum = ({ chapters }: { chapters: ChapterSummary[] }) => {
  const totalLessons = chapters.reduce((sum, c) => sum + c.lessons.length, 0);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-5">
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Curriculum
        </Typography>
        <Typography variant="body2" color="text.secondary" className="font-mono-ui">
          {chapters.length} chapters · {totalLessons} lessons
        </Typography>
      </div>

      <div className="flex flex-col gap-2.5">
        {chapters
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((chapter, index) => (
            <Accordion
              key={chapter.id}
              disableGutters
              elevation={0}
              square={false}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '12px !important',
                overflow: 'hidden',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                '&:before': { display: 'none' },
                '&:hover': {
                  borderColor: 'text.secondary',
                },
                '&.Mui-expanded': {
                  borderColor: 'primary.main',
                  boxShadow: (theme) =>
                    `0 0 0 1px ${theme.palette.primary.main}`,
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  px: 2.5,
                  py: 0.5,
                  '& .MuiAccordionSummary-content': {
                    my: 1.5,
                  },
                }}
              >
                <div className="flex items-center gap-3 w-full">
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      borderRadius: '8px',
                      bgcolor: 'action.hover',
                      flexShrink: 0,
                    }}
                  >
                    <Typography
                      className="font-mono-ui"
                      color="text.secondary"
                      sx={{ fontSize: '0.78rem', fontWeight: 600 }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 600, flexGrow: 1 }}>{chapter.title}</Typography>
                  <Chip
                    label={`${chapter.lessons.length} lessons`}
                    size="small"
                    variant="outlined"
                    className="font-mono-ui"
                    sx={{ fontSize: '0.7rem', borderColor: 'divider', color: 'text.secondary' }}
                  />
                </div>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2.5, pt: 0, pb: 1.5 }}>
                <div
                  className="flex flex-col"
                  style={{ borderTop: '1px solid', borderColor: 'inherit' }}
                >
                  {chapter.lessons
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((lesson, lessonIndex) => (
                      <Box
                        key={lesson.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          py: 1.25,
                          pl: 1,
                          ml: 4,
                          borderTop: lessonIndex === 0 ? 'none' : '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          transition: 'background-color 0.15s ease',
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                        }}
                      >
                        {lessonIcon(lesson.type)}
                        <Typography variant="body2">{lesson.title}</Typography>
                      </Box>
                    ))}
                </div>
              </AccordionDetails>
            </Accordion>
          ))}
      </div>
    </div>
  );
};

export default CourseCurriculum;