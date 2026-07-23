import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Typography, Button, IconButton, CircularProgress } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import AddIcon from '@mui/icons-material/Add';
import QuizForm from '@/features/quizzes/QuizForm';
import QuestionBuilder from '@/features/admin/components/quizzes/QuestionBuilder';
import { useAdminQuizDetail, useDeleteQuestion } from '@/features/admin/quizzes/adminQuizApi';

const AdminQuizEditorPage = () => {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('courseId') ?? '';

  const [quizId, setQuizId] = useState<string | null>(null);
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  const { data: quiz, isLoading } = useAdminQuizDetail(quizId ?? '');
  const deleteQuestion = useDeleteQuestion(quizId ?? '');

  if (!courseId) {
    return (
      <div className="p-10 text-center">
        <Typography color="text.secondary">
          Missing course context. Navigate here from a course's editor page.
        </Typography>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <Typography variant="overline" color="primary.main">
        $ quiz --build
      </Typography>
      <Typography variant="h4" sx={{ mt: 1, mb: 6, fontSize: { xs: '1.5rem', md: '2rem' } }}>
        {quizId ? 'Manage questions' : 'Create a quiz'}
      </Typography>

      {!quizId && <QuizForm courseId={courseId} onSuccess={setQuizId} />}

      {quizId && isLoading && (
        <div className="flex justify-center py-16">
          <CircularProgress />
        </div>
      )}

      {quizId && quiz && (
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
};

export default AdminQuizEditorPage;