import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Typography, Button, IconButton, CircularProgress, Chip } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import QuizForm from '@/features/admin/components/quizzes/QuizForm';
import QuestionBuilder from '@/features/admin/components/quizzes/QuestionBuilder';
import { useAdminQuizDetail, useDeleteQuestion } from '@/features/admin/quizzes/adminQuizApi';
import { useQuizzesForCourse } from '@/features/quizzes/quizzesApi';

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
        <Button startIcon={<ArrowBackIcon />} onClick={() => setQuizId(null)} sx={{ mb: 3 }}>
          Back to quizzes
        </Button>

        <Typography variant="h4" sx={{ mb: 6, fontSize: { xs: '1.5rem', md: '2rem' } }}>
          Manage questions
        </Typography>

        {quizDetailLoading && (
          <div className="flex justify-center py-16">
            <CircularProgress />
          </div>
        )}

        {quiz && (
          <div className="flex flex-col gap-4">
            {quiz.questions
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((question, index) => (
                <div key={question.id} className="flex items-start gap-3 p-4 border rounded-md" style={{ borderColor: 'inherit' }}>
                  <Typography className="font-mono-ui" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                    {String(index + 1).padStart(2, '0')}
                  </Typography>
                  <div className="flex-1">
                    <Typography sx={{ fontWeight: 600, mb: 1 }}>{question.text}</Typography>
                    <div className="flex flex-col gap-1">
                      {question.answers.map((a) => (
                        <Typography key={a.id} variant="body2" color={a.isCorrect ? 'primary.main' : 'text.secondary'}>
                          {a.isCorrect ? '✓ ' : '· '} {a.text}
                        </Typography>
                      ))}
                    </div>
                  </div>
                  <IconButton size="small" color="error" onClick={() => deleteQuestion.mutate(question.id)}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </div>
              ))}

            {showQuestionForm ? (
              <QuestionBuilder quizId={quizId} nextOrder={quiz.questions.length + 1} onDone={() => setShowQuestionForm(false)} />
            ) : (
              <Button startIcon={<AddIcon />} onClick={() => setShowQuestionForm(true)} sx={{ alignSelf: 'flex-start' }}>
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
      <Typography variant="overline" color="primary.main">
        $ quiz --course
      </Typography>
      <Typography variant="h4" sx={{ mt: 1, mb: 6, fontSize: { xs: '1.5rem', md: '2rem' } }}>
        Quizzes for this course
      </Typography>

      {quizzesLoading && (
        <div className="flex justify-center py-16">
          <CircularProgress />
        </div>
      )}

      {!quizzesLoading && existingQuizzes && existingQuizzes.length > 0 && (
        <div className="flex flex-col gap-2 mb-6">
          {existingQuizzes.map((q) => (
            <div
              key={q.id}
              onClick={() => setQuizId(q.id)}
              className="flex items-center gap-3 p-3 rounded-md border cursor-pointer hover:opacity-80"
              style={{ borderColor: 'inherit' }}
            >
              <Typography sx={{ flexGrow: 1, fontWeight: 500 }}>{q.title}</Typography>
              <Chip label={`${q._count.questions} questions`} size="small" className="font-mono-ui" sx={{ bgcolor: 'action.hover' }} />
            </div>
          ))}
        </div>
      )}

      {!showQuizForm ? (
        <Button startIcon={<AddIcon />} onClick={() => setShowQuizForm(true)} variant="outlined" sx={{ alignSelf: 'flex-start' }}>
          Create new quiz
        </Button>
      ) : (
        <QuizForm courseId={courseId} onSuccess={(newQuizId) => { setQuizId(newQuizId); setShowQuizForm(false); }} />
      )}
    </div>
  );
};

export default AdminQuizEditorPage;