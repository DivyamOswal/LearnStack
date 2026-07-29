import { useRef, useState } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
} from '@mui/material';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useCategories, useCreateCourse } from '../../courses/adminCourseApi';

interface CourseFormProps {
  onSuccess: (courseId: string) => void;
}

const CourseForm = ({ onSuccess }: CourseFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const createCourse = useCreateCourse();

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleRemoveThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCourse.mutate(
      {
        input: {
          title,
          description,
          price: parseFloat(price),
          discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
          categoryId,
          isPublished,
        },
        thumbnailFile: thumbnailFile ?? undefined,
      },
      { onSuccess: (course) => onSuccess(course.id) }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl">
      {createCourse.isError && (
        <Alert severity="error">
          {(createCourse.error as any)?.response?.data?.message ?? 'Failed to create course.'}
        </Alert>
      )}

      <TextField label="Course title" value={title} onChange={(e) => setTitle(e.target.value)} required fullWidth />

      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={4}
        required
        fullWidth
      />

      <div className="flex flex-col gap-4 sm:flex-row">
        <TextField
          label="Price (INR)"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          fullWidth
          inputProps={{ step: '0.01', min: 0 }}
        />
        <TextField
          label="Discount price (optional)"
          type="number"
          value={discountPrice}
          onChange={(e) => setDiscountPrice(e.target.value)}
          fullWidth
          inputProps={{ step: '0.01', min: 0 }}
        />
      </div>

      {categoriesLoading ? (
        <CircularProgress size={24} />
      ) : (
        <TextField
          select
          label="Category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          fullWidth
        >
          {categories?.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>
      )}

      {/* Thumbnail upload */}
      <div className="flex flex-col gap-2">
        <label className="text-sm" style={{ color: 'var(--mui-palette-text-secondary, #7D8590)' }}>
          Course thumbnail (optional)
        </label>

        {thumbnailPreview ? (
          <div className="relative w-full max-w-xs aspect-video rounded-lg overflow-hidden border" style={{ borderColor: 'inherit' }}>
            <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
            <Button
              size="small"
              onClick={handleRemoveThumbnail}
              startIcon={<CloseIcon fontSize="small" />}
              sx={{
                position: 'absolute',
                top: 6,
                right: 6,
                bgcolor: 'rgba(13,17,23,0.75)',
                color: '#fff',
                minWidth: 0,
                px: 1,
                '&:hover': { bgcolor: 'rgba(13,17,23,0.9)' },
              }}
            >
              Remove
            </Button>
          </div>
        ) : (
          <Button
            component="label"
            variant="outlined"
            startIcon={<ImageOutlinedIcon />}
            sx={{ alignSelf: 'flex-start' }}
          >
            Upload thumbnail
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleThumbnailChange}
            />
          </Button>
        )}
      </div>

      <FormControlLabel
        control={<Switch checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />}
        label="Publish immediately"
      />

      <Button type="submit" variant="contained" disableElevation size="large" disabled={createCourse.isPending}>
        {createCourse.isPending ? 'Creating...' : 'Create course'}
      </Button>
    </form>
  );
};

export default CourseForm;