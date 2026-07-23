import { useState } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  IconButton,
  Collapse,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { useCreateLesson, useDeleteLesson } from '../../courses/adminCourseApi';
import { AdminChapter, LessonType } from '../../courses/adminCourse.type';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

const lessonIcon = (type: string) => {
  switch (type) {
    case 'VIDEO': return <PlayCircleOutlinedIcon sx={{ fontSize: 16, color: 'primary.main' }} />;
    case 'ARTICLE': return <ArticleOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />;
    case 'CODE_SNIPPET': return <CodeOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />;
    default: return <DescriptionOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />;
  }
};

const LessonManager = ({ chapter }: { chapter: AdminChapter }) => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<LessonType>('ARTICLE');
  const [content, setContent] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const createLesson = useCreateLesson();
  const deleteLesson = useDeleteLesson();

  const needsContent = type === 'ARTICLE' || type === 'MARKDOWN' || type === 'CODE_SNIPPET';
  const needsVideo = type === 'VIDEO';

  const handleAdd = () => {
    if (!title.trim()) return;
    const nextOrder = chapter.lessons.length + 1;

    createLesson.mutate(
      {
        input: { title, type, order: nextOrder, chapterId: chapter.id, content: needsContent ? content : undefined },
        videoFile: needsVideo && videoFile ? videoFile : undefined,
      },
      {
        onSuccess: () => {
          setTitle('');
          setContent('');
          setVideoFile(null);
          setShowForm(false);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-2 pl-8 mt-2">
      {chapter.lessons.map((lesson) => (
        <div key={lesson.id} className="flex items-center gap-2 py-1.5">
          {lessonIcon(lesson.type)}
          <Typography variant="body2" sx={{ flexGrow: 1 }}>{lesson.title}</Typography>
          <IconButton size="small" color="error" onClick={() => setDeleteTargetId(lesson.id)}>
            <DeleteOutlinedIcon fontSize="small" />
          </IconButton>
        </div>
      ))}

      {!showForm ? (
        <Button size="small" startIcon={<AddIcon />} onClick={() => setShowForm(true)} sx={{ alignSelf: 'flex-start', mt: 1 }}>
          Add lesson
        </Button>
      ) : (
        <Collapse in={showForm}>
          <div className="flex flex-col gap-3 p-3 border rounded-md mt-1" style={{ borderColor: 'inherit' }}>
            <TextField label="Lesson title" value={title} onChange={(e) => setTitle(e.target.value)} size="small" fullWidth />
            <TextField
              select
              label="Type"
              value={type}
              onChange={(e) => setType(e.target.value as LessonType)}
              size="small"
              fullWidth
            >
              <MenuItem value="VIDEO">Video</MenuItem>
              <MenuItem value="ARTICLE">Article</MenuItem>
              <MenuItem value="MARKDOWN">Markdown</MenuItem>
              <MenuItem value="CODE_SNIPPET">Code snippet</MenuItem>
            </TextField>

            {needsContent && (
              <TextField
                label="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                multiline
                rows={4}
                size="small"
                fullWidth
              />
            )}

            {needsVideo && (
              <Button component="label" variant="outlined" size="small">
                {videoFile ? videoFile.name : 'Upload video file'}
                <input
                  type="file"
                  accept="video/*"
                  hidden
                  onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
                />
              </Button>
            )}

            <div className="flex gap-2">
              <Button
                variant="contained"
                disableElevation
                size="small"
                onClick={handleAdd}
                disabled={createLesson.isPending}
              >
                {createLesson.isPending ? 'Adding...' : 'Add lesson'}
              </Button>
              <Button size="small" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Collapse>
      )}

      <ConfirmDialog
        open={Boolean(deleteTargetId)}
        title="Delete lesson?"
        description="This will permanently remove this lesson and any student progress tied to it."
        confirmLabel="Delete"
        onConfirm={() => deleteTargetId && deleteLesson.mutate(deleteTargetId, { onSuccess: () => setDeleteTargetId(null) })}
        onCancel={() => setDeleteTargetId(null)}
        isLoading={deleteLesson.isPending}
      />
    </div>
  );
};

export default LessonManager;