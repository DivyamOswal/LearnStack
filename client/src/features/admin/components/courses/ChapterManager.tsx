import { useState } from 'react';
import { TextField, Button, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useChaptersForCourse, useCreateChapter } from '../../courses/adminCourseApi';

const ChapterManager = ({ courseId }: { courseId: string }) => {
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const { data: chapters, isLoading } = useChaptersForCourse(courseId);
  const createChapter = useCreateChapter();

  const handleAddChapter = () => {
    if (!newChapterTitle.trim()) return;
    const nextOrder = (chapters?.length ?? 0) + 1;
    createChapter.mutate(
      { title: newChapterTitle, order: nextOrder, courseId },
      { onSuccess: () => setNewChapterTitle('') }
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <Typography variant="h6">Chapters</Typography>

      {isLoading && <Typography color="text.secondary">Loading chapters...</Typography>}

      <div className="flex flex-col gap-2">
        {chapters?.map((chapter, index) => (
          <div
            key={chapter.id}
            className="flex items-center gap-3 p-3 rounded-md border"
            style={{ borderColor: 'inherit' }}
          >
            <Typography className="font-mono-ui" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
              {String(index + 1).padStart(2, '0')}
            </Typography>
            <Typography sx={{ fontWeight: 600, flexGrow: 1 }}>{chapter.title}</Typography>
            <Typography variant="body2" color="text.secondary" className="font-mono-ui">
              {chapter.lessons.length} lessons
            </Typography>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <TextField
          placeholder="New chapter title"
          value={newChapterTitle}
          onChange={(e) => setNewChapterTitle(e.target.value)}
          size="small"
          fullWidth
        />
        <IconButton onClick={handleAddChapter} disabled={createChapter.isPending} color="primary">
          <AddIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default ChapterManager;