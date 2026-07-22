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
import { useAdminCourseList, useTogglePublish, useDeleteCourse } from '@/features/admin/courses/adminCourseApi';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';
import { formatCurrency } from '@/utils/formatCurrency';

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
          <Typography variant="overline" color="primary.main">
            $ admin --courses
          </Typography>
          <Typography variant="h4" sx={{ mt: 1, fontSize: { xs: '1.5rem', md: '2rem' } }}>
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
          <div className="hidden md:block border rounded-lg overflow-hidden" style={{ borderColor: 'inherit' }}>
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: 'inherit' }}>
                  <th className="text-left p-3 text-sm font-medium" style={{ color: 'inherit' }}>Course</th>
                  <th className="text-left p-3 text-sm font-medium">Category</th>
                  <th className="text-left p-3 text-sm font-medium">Price</th>
                  <th className="text-left p-3 text-sm font-medium">Published</th>
                  <th className="text-right p-3 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.courses.map((course) => (
                  <tr key={course.id} className="border-b last:border-b-0" style={{ borderColor: 'inherit' }}>
                    <td className="p-3">
                      <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{course.title}</Typography>
                    </td>
                    <td className="p-3">
                      <Chip label={course.category.name} size="small" className="font-mono-ui" sx={{ bgcolor: 'action.hover' }} />
                    </td>
                    <td className="p-3 font-mono-ui text-sm">{formatCurrency(course.price)}</td>
                    <td className="p-3">
                      <Switch
                        checked={course.isPublished}
                        onChange={() => togglePublish.mutate({ id: course.id, isPublished: !course.isPublished })}
                        size="small"
                      />
                    </td>
                    <td className="p-3 text-right">
                      <IconButton component={RouterLink} to={`/admin/courses/${course.id}`} size="small">
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteTarget({ id: course.id, title: course.title })}
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
              <div key={course.id} className="border rounded-lg p-4 flex flex-col gap-2" style={{ borderColor: 'inherit' }}>
                <div className="flex items-start justify-between gap-2">
                  <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>{course.title}</Typography>
                  <Switch
                    checked={course.isPublished}
                    onChange={() => togglePublish.mutate({ id: course.id, isPublished: !course.isPublished })}
                    size="small"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Chip label={course.category.name} size="small" className="font-mono-ui" sx={{ bgcolor: 'action.hover' }} />
                  <Typography variant="body2" className="font-mono-ui">{formatCurrency(course.price)}</Typography>
                </div>
                <div className="flex gap-2 mt-1">
                  <Button
                    component={RouterLink}
                    to={`/admin/courses/${course.id}`}
                    size="small"
                    startIcon={<EditOutlinedIcon fontSize="small" />}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteOutlinedIcon fontSize="small" />}
                    onClick={() => setDeleteTarget({ id: course.id, title: course.title })}
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