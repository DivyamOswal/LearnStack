import { useState } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
} from '@mui/material';
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

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const createCourse = useCreateCourse();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCourse.mutate(
      {
        title,
        description,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
        categoryId,
        isPublished,
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
          label="Price (USD)"
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