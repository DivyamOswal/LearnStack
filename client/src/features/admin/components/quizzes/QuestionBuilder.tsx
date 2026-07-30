
import { useState } from 'react';
import {
  Alert, Box, Button, Card, CardContent, Checkbox, Chip, Divider,
  IconButton, MenuItem, Paper, Radio, Stack, TextField, Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
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
      setAnswers([{ text: 'True', isCorrect: false }, { text: 'False', isCorrect: false }]);
    } else if (answers.length < 2) {
      setAnswers([{ text: '', isCorrect: false }, { text: '', isCorrect: false }]);
    }
  };

  const handleAnswerTextChange = (i:number,v:string)=>setAnswers(p=>p.map((a,x)=>x===i?{...a,text:v}:a));
  const handleCorrectToggle = (i:number)=>setAnswers(p=>isMultiAnswer?p.map((a,x)=>x===i?{...a,isCorrect:!a.isCorrect}:a):p.map((a,x)=>({...a,isCorrect:x===i})));
  const handleAddOption=()=>setAnswers(p=>[...p,{text:'',isCorrect:false}]);
  const handleRemoveOption=(i:number)=>setAnswers(p=>p.filter((_,x)=>x!==i));

  const validate=()=>{
    if(!text.trim()) return 'Question text is required.';
    if(answers.some(a=>!a.text.trim())) return 'All answer options need text.';
    if(isTrueFalse && answers.length!==2) return 'True/False questions must have exactly 2 answers.';
    if(!answers.some(a=>a.isCorrect)) return 'Mark at least one answer as correct.';
    if(!isMultiAnswer && answers.filter(a=>a.isCorrect).length>1) return 'Only Multiple Answer supports multiple correct answers.';
    return null;
  };

  const handleSubmit=()=>{
    const err=validate();
    if(err){setValidationError(err);return;}
    setValidationError(null);
    createQuestion.mutate({text,type,order:nextOrder,points:parseInt(points,10)||1,answers},{onSuccess:onDone});
  };

  return (
    <Paper elevation={0} sx={{border:'1px solid',borderColor:'divider',borderRadius:3,overflow:'hidden'}}>
      <Box sx={{p:2.5,borderBottom:'1px solid',borderColor:'divider',bgcolor:'background.default'}}>
        <Stack direction="row" spacing={2} alignItems="center">
          <QuizOutlinedIcon color="primary"/>
          <Box flex={1}>
            <Typography variant="h6" fontWeight={700}>Create Question</Typography>
            <Typography variant="body2" color="text.secondary">Configure question, answers and scoring.</Typography>
          </Box>
          <Chip label={`${points} pts`} color="primary" variant="outlined"/>
        </Stack>
      </Box>
      <Card elevation={0}><CardContent>
      <Stack spacing={3}>
        {validationError && <Alert severity="warning">{validationError}</Alert>}
        {createQuestion.isError && <Alert severity="error">Failed to add question.</Alert>}

        <TextField label="Question" multiline rows={3} fullWidth value={text} onChange={e=>setText(e.target.value)} helperText={`${text.length} characters`}/>

        <Stack direction={{xs:'column',md:'row'}} spacing={2}>
          <TextField select fullWidth label="Question Type" value={type} onChange={e=>handleTypeChange(e.target.value as QuestionType)}>
            <MenuItem value="MCQ">Single Choice (MCQ)</MenuItem>
            <MenuItem value="MULTIPLE_ANSWER">Multiple Answer</MenuItem>
            <MenuItem value="TRUE_FALSE">True / False</MenuItem>
            <MenuItem value="FILL_IN_BLANK">Fill in the Blank</MenuItem>
          </TextField>
          <TextField label="Points" type="number" value={points} onChange={e=>setPoints(e.target.value)} sx={{width:{md:140}}}/>
        </Stack>

        <Divider/>
        <Typography fontWeight={700}>Answer Options</Typography>
        <Typography variant="body2" color="text.secondary">
          {isMultiAnswer?'Select all correct answers.':'Select one correct answer.'}
        </Typography>

        <Stack spacing={2}>
        {answers.map((a,i)=>(
          <Paper key={i} variant="outlined" sx={{p:2,borderRadius:2}}>
            <Stack direction="row" spacing={2} alignItems="center">
              {isMultiAnswer?
                <Checkbox checked={a.isCorrect} onChange={()=>handleCorrectToggle(i)}/>:
                <Radio checked={a.isCorrect} onChange={()=>handleCorrectToggle(i)}/>}
              <TextField fullWidth disabled={isTrueFalse} value={a.text} onChange={e=>handleAnswerTextChange(i,e.target.value)} label={`Option ${i+1}`}/>
              {a.isCorrect && <CheckCircleOutlineOutlinedIcon color="success"/>}
              {!isTrueFalse && answers.length>2 &&
                <IconButton color="error" onClick={()=>handleRemoveOption(i)}>
                  <DeleteOutlinedIcon/>
                </IconButton>}
            </Stack>
          </Paper>
        ))}
        </Stack>

        {!isTrueFalse &&
          <Button variant="outlined" startIcon={<AddIcon/>} onClick={handleAddOption} sx={{alignSelf:'flex-start',textTransform:'none'}}>
            Add Option
          </Button>}

        <Divider/>

        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleSubmit} disabled={createQuestion.isPending}>
            {createQuestion.isPending?'Adding...':'Add Question'}
          </Button>
          <Button variant="outlined" onClick={onDone}>Cancel</Button>
        </Stack>
      </Stack>
      </CardContent></Card>
    </Paper>
  );
};

export default QuestionBuilder;