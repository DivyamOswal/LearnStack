import { useState } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Checkbox,
  Radio,
  IconButton,
  Typography,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useCreateQuestion } from '../../quizzes/adminQuizApi';
import { QuestionType, AdminAnswer } from '../../quizzes/adminQuiz.types';

interface QuestionBuilderProps {
  quizId: string;
  nextOrder: number;
  onDone: () => void;
}

const QuestionBuilder = ({ quizId, nextOrder, onDone }: QuestionBuilderProps) => {
  const [text, setText] = useState('');
  const [type, setType] = useState<QuestionType>('MCQ');
  const [points, setPoints] = useState('1');
  const [answers, setAnswers] = useState<AdminAnswer[]>([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ]);
  const [validationError, setValidationError] = useState<string | null>(null);

  const createQuestion = useCreateQuestion(quizId);

  const isMultiAnswer = type === 'MULTIPLE_ANSWER';
  const isTrueFalse = type === 'TRUE_FALSE';

  const handleTypeChange = (newType: QuestionType) => {
    setType(newType);
    if (newType === 'TRUE_FALSE') {
      setAnswers([
        { text: 'True', isCorrect: false },
        { text: 'False', isCorrect: false },
      ]);
    } else if (answers.length < 2) {
      setAnswers([{ text: '', isCorrect: false }, { text: '', isCorrect: false }]);
    }
  };

  const handleAnswerTextChange = (index: number, value: string) => {
    setAnswers((prev) => prev.map((a, i) => (i === index ? { ...a, text: value } : a)));
  };

  const handleCorrectToggle = (index: number) => {
    setAnswers((prev) => {
      if (isMultiAnswer) {
        return prev.map((a, i) => (i === index ? { ...a, isCorrect: !a.isCorrect } : a));
      }
      return prev.map((a, i) => ({ ...a, isCorrect: i === index }));
    });
  };

  const handleAddOption = () => setAnswers((prev) => [...prev, { text: '', isCorrect: false }]);
  const handleRemoveOption = (index: number) => setAnswers((prev) => prev.filter((_, i) => i !== index));

  const validate = (): string | null => {
    if (!text.trim()) return 'Question text is required.';
    if (answers.some((a) => !a.text.trim())) return 'All answer options need text.';
    if (isTrueFalse && answers.length !== 2) return 'True/False questions must have exactly 2 answers.';
    if (!answers.some((a) => a.isCorrect)) return 'Mark at least one answer as correct.';
    if (!isMultiAnswer && answers.filter((a) => a.isCorrect).length > 1) {
      return 'Only Multiple Answer questions can have more than one correct answer.';
    }
    return null;
  };

  const handleSubmit = () => {
    const error = validate();
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError(null);

    createQuestion.mutate(
      { text, type, order: nextOrder, points: parseInt(points, 10) || 1, answers },
      { onSuccess: onDone }
    );
  };

  return (
    <div className="flex flex-col gap-3 p-4 border rounded-md" style={{ borderColor: 'inherit' }}>
      {validationError && <Alert severity="warning">{validationError}</Alert>}
      {createQuestion.isError && <Alert severity="error">Failed to add question. Please try again.</Alert>}

      <TextField label="Question text" value={text} onChange={(e) => setText(e.target.value)} multiline rows={2} fullWidth size="small" />

      <div className="flex flex-col gap-3 sm:flex-row">
        <TextField select label="Type" value={type} onChange={(e) => handleTypeChange(e.target.value as QuestionType)} size="small" fullWidth>
          <MenuItem value="MCQ">Single choice (MCQ)</MenuItem>
          <MenuItem value="MULTIPLE_ANSWER">Multiple answer</MenuItem>
          <MenuItem value="TRUE_FALSE">True / False</MenuItem>
          <MenuItem value="FILL_IN_BLANK">Fill in the blank</MenuItem>
        </TextField>
        <TextField label="Points" type="number" value={points} onChange={(e) => setPoints(e.target.value)} size="small" sx={{ maxWidth: { sm: 120 } }} />
      </div>

      <Typography variant="caption" color="text.secondary">
        {isMultiAnswer ? 'Check every correct answer.' : 'Select the one correct answer.'}
      </Typography>

      <div className="flex flex-col gap-2">
        {answers.map((answer, index) => (
          <div key={index} className="flex items-center gap-2">
            {isMultiAnswer ? (
              <Checkbox checked={answer.isCorrect} onChange={() => handleCorrectToggle(index)} size="small" />
            ) : (
              <Radio checked={answer.isCorrect} onChange={() => handleCorrectToggle(index)} size="small" />
            )}
            <TextField
              value={answer.text}
              onChange={(e) => handleAnswerTextChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              size="small"
              fullWidth
              disabled={isTrueFalse}
            />
            {!isTrueFalse && answers.length > 2 && (
              <IconButton size="small" onClick={() => handleRemoveOption(index)}>
                <DeleteOutlinedIcon fontSize="small" />
              </IconButton>
            )}
          </div>
        ))}
      </div>

      {!isTrueFalse && (
        <Button size="small" startIcon={<AddIcon />} onClick={handleAddOption} sx={{ alignSelf: 'flex-start' }}>
          Add option
        </Button>
      )}

      <div className="flex gap-2 mt-2">
        <Button variant="contained" disableElevation onClick={handleSubmit} disabled={createQuestion.isPending}>
          {createQuestion.isPending ? 'Adding...' : 'Add question'}
        </Button>
        <Button onClick={onDone}>Cancel</Button>
      </div>
    </div>
  );
};

export default QuestionBuilder;