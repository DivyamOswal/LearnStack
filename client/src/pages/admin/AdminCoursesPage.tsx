import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Typography,
  Button,
  Switch,
  IconButton,
  Chip,
  CircularProgress,
  Pagination,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { useAdminCourseList, useTogglePublish, useDeleteCourse } from '@/features/admin/courses/adminCourseApi';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';
import { formatCurrency } from '@/utils/formatCurrency';

const glassPanel = {
  bgcolor: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 3,
  backdropFilter: 'blur(12px)',
};

const AdminCoursesPage = () => {
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const { data, isLoading } = useAdminCourseList(page);
  const togglePublish = useTogglePublish();
  const deleteCourse = useDeleteCourse();

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteCourse.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography variant="overline" color="primary.main" className="font-mono-ui">
            $ admin --courses
          </Typography>
          <Typography variant="h4" sx={{ mt: 1, fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700 }}>
            Manage courses
          </Typography>
        </div>
        <Button
          component={RouterLink}
          to="/admin/courses/new"
          variant="contained"
          disableElevation
          startIcon={<AddIcon />}
          className="w-full sm:w-auto"
          sx={{
            borderRadius: 2,
            px: 3,
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
          }}
        >
          New course
        </Button>
      </div>

      {isLoading && (
        <div className="flex justify-center py-20">
          <CircularProgress />
        </div>
      )}

      {!isLoading && data && data.courses.length === 0 && (
        <EmptyState title="No courses yet" description="Create your first course to get started." />
      )}

      {!isLoading && data && data.courses.length > 0 && (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-hidden" style={glassPanel}>
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th className="text-left p-4 text-xs font-mono-ui uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.5)' }}>Course</th>
                  <th className="text-left p-4 text-xs font-mono-ui uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.5)' }}>Category</th>
                  <th className="text-left p-4 text-xs font-mono-ui uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.5)' }}>Price</th>
                  <th className="text-left p-4 text-xs font-mono-ui uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.5)' }}>Status</th>
                  <th className="text-right p-4 text-xs font-mono-ui uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.5)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.courses.map((course) => (
                  <tr
                    key={course.id}
                    className="transition-colors hover:bg-white/5"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex items-center justify-center rounded-lg shrink-0"
                          style={{
                            width: 38,
                            height: 38,
                            background: course.isPublished
                              ? 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(99,102,241,0.08))'
                              : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${course.isPublished ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)'}`,
                          }}
                        >
                          <SchoolOutlinedIcon
                            sx={{ fontSize: 18, color: course.isPublished ? 'primary.main' : 'text.disabled' }}
                          />
                        </div>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{course.title}</Typography>
                      </div>
                    </td>
                    <td className="p-4">
                      <Chip
                        label={course.category.name}
                        size="small"
                        className="font-mono-ui"
                        sx={{ bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                      />
                    </td>
                    <td className="p-4 font-mono-ui text-sm" style={{ fontWeight: 600 }}>{formatCurrency(course.price)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Chip
                          label={course.isPublished ? 'published' : 'draft'}
                          size="small"
                          className="font-mono-ui"
                          sx={{
                            bgcolor: course.isPublished ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.06)',
                            color: course.isPublished ? '#4ade80' : 'text.secondary',
                            border: `1px solid ${course.isPublished ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}`,
                            fontWeight: 600,
                          }}
                        />
                        <Switch
                          checked={course.isPublished}
                          onChange={() => togglePublish.mutate({ id: course.id, isPublished: !course.isPublished })}
                          size="small"
                        />
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <IconButton
                        component={RouterLink}
                        to={`/admin/courses/${course.id}`}
                        size="small"
                        sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'rgba(99,102,241,0.1)' } }}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => setDeleteTarget({ id: course.id, title: course.title })}
                        sx={{ color: 'text.secondary', '&:hover': { color: '#f87171', bgcolor: 'rgba(239,68,68,0.1)' } }}
                      >
                        <DeleteOutlinedIcon fontSize="small" />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="flex flex-col gap-3 md:hidden">
            {data.courses.map((course) => (
              <div key={course.id} style={glassPanel} className="p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center rounded-lg shrink-0"
                      style={{
                        width: 38,
                        height: 38,
                        background: course.isPublished
                          ? 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(99,102,241,0.08))'
                          : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${course.isPublished ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)'}`,
                      }}
                    >
                      <SchoolOutlinedIcon
                        sx={{ fontSize: 18, color: course.isPublished ? 'primary.main' : 'text.disabled' }}
                      />
                    </div>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>{course.title}</Typography>
                  </div>
                  <Switch
                    checked={course.isPublished}
                    onChange={() => togglePublish.mutate({ id: course.id, isPublished: !course.isPublished })}
                    size="small"
                  />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Chip
                    label={course.category.name}
                    size="small"
                    className="font-mono-ui"
                    sx={{ bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                  <Chip
                    label={course.isPublished ? 'published' : 'draft'}
                    size="small"
                    className="font-mono-ui"
                    sx={{
                      bgcolor: course.isPublished ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.06)',
                      color: course.isPublished ? '#4ade80' : 'text.secondary',
                      border: `1px solid ${course.isPublished ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}`,
                      fontWeight: 600,
                    }}
                  />
                  <Typography variant="body2" className="font-mono-ui" sx={{ fontWeight: 600, ml: 'auto' }}>
                    {formatCurrency(course.price)}
                  </Typography>
                </div>
                <div className="flex gap-2 mt-1">
                  <Button
                    component={RouterLink}
                    to={`/admin/courses/${course.id}`}
                    size="small"
                    startIcon={<EditOutlinedIcon fontSize="small" />}
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    startIcon={<DeleteOutlinedIcon fontSize="small" />}
                    onClick={() => setDeleteTarget({ id: course.id, title: course.title })}
                    sx={{ textTransform: 'none', borderRadius: 2, color: '#f87171' }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination count={data.totalPages} page={page} onChange={(_, value) => setPage(value)} color="primary" shape="rounded" />
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete course?"
        description={`This will permanently delete "${deleteTarget?.title}" and all its chapters, lessons, and content. This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteCourse.isPending}
      />
    </div>
  );
};

export default AdminCoursesPage;