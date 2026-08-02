import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Typography, Button, IconButton, CircularProgress, Chip } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlined';
import QuizForm from '@/features/admin/components/quizzes/QuizForm';
import QuestionBuilder from '@/features/admin/components/quizzes/QuestionBuilder';
import { useAdminQuizDetail, useDeleteQuestion } from '@/features/admin/quizzes/adminQuizApi';
import { useQuizzesForCourse } from '@/features/quizzes/quizzesApi';

const glassPanel = {
  bgcolor: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 3,
  backdropFilter: 'blur(12px)',
};

const iconBadge = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 2,
  flexShrink: 0,
  background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(99,102,241,0.08))',
  border: '1px solid rgba(99,102,241,0.4)',
} as const;

const AdminQuizEditorPage = () => {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('courseId') ?? '';

  const [quizId, setQuizId] = useState<string | null>(null);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  const { data: existingQuizzes, isLoading: quizzesLoading } = useQuizzesForCourse(courseId);
  const { data: quiz, isLoading: quizDetailLoading } = useAdminQuizDetail(quizId ?? '');
  const deleteQuestion = useDeleteQuestion(quizId ?? '');

  if (!courseId) {
    return (
      <div className="p-10 text-center">
        <Typography color="text.secondary">
          Missing course context. Navigate here from Admin → Quizzes.
        </Typography>
      </div>
    );
  }

  // ---------- Viewing a specific quiz's questions ----------
  if (quizId) {
    return (
      <div className="p-6 md:p-10 max-w-3xl mx-auto">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => setQuizId(null)}
          sx={{
            mb: 3,
            textTransform: 'none',
            borderRadius: 2,
            color: 'text.secondary',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
          }}
        >
          Back to quizzes
        </Button>

        <div className="flex items-center gap-3 mb-1">
          <div style={{ width: 38, height: 38, ...iconBadge }}>
            <QuizOutlinedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
          </div>
          <Typography variant="overline" color="primary.main" className="font-mono-ui">
            $ quiz --questions
          </Typography>
        </div>

        <Typography variant="h4" sx={{ mt: 1, mb: 6, fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700 }}>
          Manage questions
        </Typography>

        {quizDetailLoading && (
          <div className="flex justify-center py-16">
            <CircularProgress />
          </div>
        )}

        {quiz && (
          <div className="flex flex-col gap-3">
            {quiz.questions
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((question, index) => (
                <div key={question.id} style={glassPanel} className="flex items-start gap-3 p-4">
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      ...iconBadge,
                    }}
                  >
                    <Typography className="font-mono-ui" sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'primary.main' }}>
                      {String(index + 1).padStart(2, '0')}
                    </Typography>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Typography sx={{ fontWeight: 700, mb: 1.5 }}>{question.text}</Typography>
                    <div className="flex flex-col gap-1.5">
                      {question.answers.map((a) => (
                        <div
                          key={a.id}
                          className="px-3 py-1.5 rounded-md"
                          style={{
                            background: a.isCorrect ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${a.isCorrect ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.06)'}`,
                          }}
                        >
                          <Typography variant="body2" sx={{ color: a.isCorrect ? '#4ade80' : 'text.secondary' }}>
                            {a.isCorrect ? '✓ ' : '· '} {a.text}
                          </Typography>
                        </div>
                      ))}
                    </div>
                  </div>
                  <IconButton
                    size="small"
                    onClick={() => deleteQuestion.mutate(question.id)}
                    sx={{ color: 'text.secondary', '&:hover': { color: '#f87171', bgcolor: 'rgba(239,68,68,0.1)' } }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </div>
              ))}

            {showQuestionForm ? (
              <QuestionBuilder quizId={quizId} nextOrder={quiz.questions.length + 1} onDone={() => setShowQuestionForm(false)} />
            ) : (
              <Button
                startIcon={<AddIcon />}
                onClick={() => setShowQuestionForm(true)}
                sx={{
                  alignSelf: 'flex-start',
                  textTransform: 'none',
                  borderRadius: 2,
                  fontWeight: 600,
                  bgcolor: 'rgba(99,102,241,0.12)',
                  color: 'primary.main',
                  border: '1px solid rgba(99,102,241,0.3)',
                  px: 2,
                  '&:hover': { bgcolor: 'rgba(99,102,241,0.2)' },
                }}
              >
                Add question
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }

  // ---------- Listing existing quizzes for this course, or creating a new one ----------
  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-1">
        <div style={{ width: 38, height: 38, ...iconBadge }}>
          <QuizOutlinedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
        </div>
        <Typography variant="overline" color="primary.main" className="font-mono-ui">
          $ quiz --course
        </Typography>
      </div>

      <Typography variant="h4" sx={{ mt: 1, mb: 6, fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700 }}>
        Quizzes for this course
      </Typography>

      {quizzesLoading && (
        <div className="flex justify-center py-16">
          <CircularProgress />
        </div>
      )}

      {!quizzesLoading && existingQuizzes && existingQuizzes.length > 0 && (
        <div className="flex flex-col gap-3 mb-6">
          {existingQuizzes.map((q) => (
            <div
              key={q.id}
              onClick={() => setQuizId(q.id)}
              style={glassPanel}
              className="flex items-center gap-3 p-4 cursor-pointer transition-colors hover:bg-white/5"
            >
              <div style={{ width: 40, height: 40, ...iconBadge }}>
                <HelpOutlineIcon sx={{ fontSize: 18, color: 'primary.main' }} />
              </div>
              <Typography sx={{ flexGrow: 1, fontWeight: 700 }}>{q.title}</Typography>
              <Chip
                label={`${q._count.questions} questions`}
                size="small"
                className="font-mono-ui"
                sx={{
                  bgcolor: 'rgba(99,102,241,0.12)',
                  color: 'primary.main',
                  border: '1px solid rgba(99,102,241,0.3)',
                  fontWeight: 600,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {!showQuizForm ? (
        <Button
          startIcon={<AddIcon />}
          onClick={() => setShowQuizForm(true)}
          variant="outlined"
          sx={{
            alignSelf: 'flex-start',
            textTransform: 'none',
            borderRadius: 2,
            borderColor: 'rgba(99,102,241,0.4)',
            color: 'primary.main',
          }}
        >
          Create new quiz
        </Button>
      ) : (
        <QuizForm courseId={courseId} onSuccess={(newQuizId) => { setQuizId(newQuizId); setShowQuizForm(false); }} />
      )}
    </div>
  );
};

export default AdminQuizEditorPage;