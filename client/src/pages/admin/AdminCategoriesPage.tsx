import { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/features/admin/categories/adminCategoryApi';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';

const AdminCategoriesPage = () => {
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const { data: categories, isLoading } = useAdminCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const handleCreate = () => {
    if (!newName.trim()) return;
    createCategory.mutate(newName, { onSuccess: () => setNewName('') });
  };

  const startEditing = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const handleSaveEdit = () => {
    if (!editingId || !editingName.trim()) return;
    updateCategory.mutate({ id: editingId, name: editingName }, { onSuccess: () => setEditingId(null) });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteCategory.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  };

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto">
      <Typography variant="overline" color="primary.main">
        $ admin --categories
      </Typography>
      <Typography variant="h4" sx={{ mt: 1, mb: 6, fontSize: { xs: '1.5rem', md: '2rem' } }}>
        Manage categories
      </Typography>

      <div className="flex gap-2 mb-8">
        <TextField
          placeholder="e.g. Machine Learning"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          size="small"
          fullWidth
        />
        <Button
          variant="contained"
          disableElevation
          startIcon={<AddIcon />}
          onClick={handleCreate}
          disabled={createCategory.isPending}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Add
        </Button>
      </div>

      {createCategory.isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to create category — it may already exist.
        </Alert>
      )}

      {isLoading && (
        <div className="flex justify-center py-16">
          <CircularProgress />
        </div>
      )}

      {!isLoading && categories && categories.length === 0 && (
        <EmptyState title="No categories yet" description="Add your first category above." />
      )}

      {!isLoading && categories && categories.length > 0 && (
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-3 p-3 rounded-md border"
              style={{ borderColor: 'inherit' }}
            >
              {editingId === cat.id ? (
                <>
                  <TextField
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                    size="small"
                    fullWidth
                    autoFocus
                  />
                  <IconButton size="small" color="primary" onClick={handleSaveEdit} disabled={updateCategory.isPending}>
                    <CheckIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => setEditingId(null)}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <>
                  <Typography sx={{ flexGrow: 1, fontWeight: 500 }}>{cat.name}</Typography>
                  <Chip
                    label={`${cat._count.courses} courses`}
                    size="small"
                    className="font-mono-ui"
                    sx={{ bgcolor: 'action.hover' }}
                  />
                  <IconButton size="small" onClick={() => startEditing(cat.id, cat.name)}>
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => setDeleteTarget({ id: cat.id, name: cat.name })}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete category?"
        description={`Deleting "${deleteTarget?.name}" may fail if courses are still assigned to it — you'll need to reassign them first.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteCategory.isPending}
      />
    </div>
  );
};

export default AdminCategoriesPage;