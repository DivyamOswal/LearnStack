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
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import {
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/features/admin/categories/adminCategoryApi';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';

const glassPanel = {
  bgcolor: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 3,
  backdropFilter: 'blur(12px)',
};

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
      <Typography variant="overline" color="primary.main" className="font-mono-ui">
        $ admin --categories
      </Typography>
      <Typography variant="h4" sx={{ mt: 1, mb: 1, fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700 }}>
        Manage categories
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 5 }}>
        Organize courses into browsable categories.
      </Typography>

      {/* Add category panel */}
      <div style={glassPanel} className="p-5 mb-8 relative overflow-hidden">
        <div
          className="absolute -top-16 -right-16 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.25), transparent 70%)' }}
        />
        <Typography
          variant="caption"
          className="font-mono-ui"
          sx={{ color: 'text.secondary', letterSpacing: 1, textTransform: 'uppercase', mb: 2, display: 'block' }}
        >
          New category
        </Typography>

        {createCategory.isError && (
          <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
            Failed to create category — it may already exist.
          </Alert>
        )}

        <div className="flex gap-2">
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
            disabled={createCategory.isPending || !newName.trim()}
            sx={{ whiteSpace: 'nowrap', borderRadius: 2, fontWeight: 600, textTransform: 'none', px: 3 }}
          >
            Add
          </Button>
        </div>
      </div>

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
          {categories.map((cat) => {
            const isEditing = editingId === cat.id;
            return (
              <div
                key={cat.id}
                style={{
                  ...glassPanel,
                  ...(isEditing && {
                    border: '1px solid rgba(99,102,241,0.4)',
                    bgcolor: 'rgba(99,102,241,0.05)',
                  }),
                }}
                className="flex items-center gap-3 p-3 transition-colors hover:bg-white/5"
              >
                {isEditing ? (
                  <>
                    <TextField
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                      size="small"
                      fullWidth
                      autoFocus
                    />
                    <IconButton
                      size="small"
                      onClick={handleSaveEdit}
                      disabled={updateCategory.isPending}
                      sx={{ color: 'primary.main', bgcolor: 'rgba(99,102,241,0.1)', '&:hover': { bgcolor: 'rgba(99,102,241,0.2)' } }}
                    >
                      <CheckIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => setEditingId(null)}
                      sx={{ color: 'text.secondary' }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <div
                      className="flex items-center justify-center rounded-lg shrink-0"
                      style={{
                        width: 38,
                        height: 38,
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(99,102,241,0.08))',
                        border: '1px solid rgba(99,102,241,0.4)',
                      }}
                    >
                      <CategoryOutlinedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                    </div>
                    <Typography sx={{ flexGrow: 1, fontWeight: 600 }}>{cat.name}</Typography>
                    <Chip
                      label={`${cat._count.courses} courses`}
                      size="small"
                      className="font-mono-ui"
                      sx={{ bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => startEditing(cat.id, cat.name)}
                      sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'rgba(99,102,241,0.1)' } }}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => setDeleteTarget({ id: cat.id, name: cat.name })}
                      sx={{ color: 'text.secondary', '&:hover': { color: '#f87171', bgcolor: 'rgba(239,68,68,0.1)' } }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </>
                )}
              </div>
            );
          })}
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