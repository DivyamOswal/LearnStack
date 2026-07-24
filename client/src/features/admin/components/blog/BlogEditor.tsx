import { useState } from 'react';
import { TextField, Button, FormControlLabel, Switch, Alert } from '@mui/material';
import { useCreateBlog } from '../../../blog/blogApi';

const BlogEditor = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const createBlog = useCreateBlog();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBlog.mutate(
      { input: { title, content, isPublished }, coverImage: coverImage ?? undefined },
      { onSuccess: () => { setTitle(''); setContent(''); setIsPublished(false); setCoverImage(null); } }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl">
      {createBlog.isError && <Alert severity="error">Failed to create post.</Alert>}
      {createBlog.isSuccess && <Alert severity="success">Post created.</Alert>}

      <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required fullWidth size="small" />

      <TextField
        label="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        multiline
        rows={10}
        required
        fullWidth
      />

      <Button component="label" variant="outlined" size="small" sx={{ alignSelf: 'flex-start' }}>
        {coverImage ? coverImage.name : 'Upload cover image (optional)'}
        <input type="file" accept="image/*" hidden onChange={(e) => setCoverImage(e.target.files?.[0] ?? null)} />
      </Button>

      <FormControlLabel
        control={<Switch checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />}
        label="Publish immediately"
      />

      <Button type="submit" variant="contained" disableElevation disabled={createBlog.isPending} sx={{ alignSelf: 'flex-start' }}>
        {createBlog.isPending ? 'Publishing...' : 'Create post'}
      </Button>
    </form>
  );
};

export default BlogEditor;