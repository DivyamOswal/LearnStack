import { useState } from 'react';
import {
  Typography,
  TextField,
  MenuItem,
  Select,
  Chip,
  Avatar,
  IconButton,
  CircularProgress,
  Pagination,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useAdminUserList, useUpdateUserRole, useDeleteUser } from '@/features/admin/components/users/adminUserApi';
import { Role } from '@/features/admin/components/users/adminUser.types';
import { useAppSelector } from '@/app/hooks';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';
import { useDebounce } from '@/hooks/useDebounce';

const AdminUsersPage = () => {
  const currentUser = useAppSelector((state) => state.auth.user);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | ''>('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useAdminUserList({
    page,
    limit: 15,
    search: debouncedSearch || undefined,
    role: roleFilter || undefined,
  });

  const updateRole = useUpdateUserRole();
  const deleteUser = useDeleteUser();

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteUser.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <Typography variant="overline" color="primary.main">
        $ admin --users
      </Typography>
      <Typography variant="h4" sx={{ mt: 1, mb: 6, fontSize: { xs: '1.5rem', md: '2rem' } }}>
        Manage users
      </Typography>

      <div className="flex flex-col gap-3 mb-6 sm:flex-row">
        <TextField
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: { sm: 360 } }}
        />
        <Select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value as Role | '');
            setPage(1);
          }}
          size="small"
          displayEmpty
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">All roles</MenuItem>
          <MenuItem value="STUDENT">Student</MenuItem>
          <MenuItem value="ADMIN">Admin</MenuItem>
        </Select>
      </div>

      {isLoading && (
        <div className="flex justify-center py-20">
          <CircularProgress />
        </div>
      )}

      {!isLoading && data && data.users.length === 0 && (
        <EmptyState title="No users found" description="Try a different search term or filter." />
      )}

      {!isLoading && data && data.users.length > 0 && (
        <>
          {/* Desktop table */}
          <div className="hidden md:block border rounded-lg overflow-hidden" style={{ borderColor: 'inherit' }}>
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: 'inherit' }}>
                  <th className="text-left p-3 text-sm font-medium">User</th>
                  <th className="text-left p-3 text-sm font-medium">Email</th>
                  <th className="text-left p-3 text-sm font-medium">Verified</th>
                  <th className="text-left p-3 text-sm font-medium">Role</th>
                  <th className="text-right p-3 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((user) => (
                  <tr key={user.id} className="border-b last:border-b-0" style={{ borderColor: 'inherit' }}>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Avatar src={user.avatarUrl ?? undefined} sx={{ width: 28, height: 28, fontSize: '0.8rem' }}>
                          {user.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</Typography>
                      </div>
                    </td>
                    <td className="p-3">
                      <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                    </td>
                    <td className="p-3">
                      <Chip
                        label={user.isVerified ? 'verified' : 'unverified'}
                        size="small"
                        className="font-mono-ui"
                        color={user.isVerified ? 'success' : 'default'}
                        variant={user.isVerified ? 'filled' : 'outlined'}
                      />
                    </td>
                    <td className="p-3">
                      <Select
                        value={user.role}
                        onChange={(e) => updateRole.mutate({ id: user.id, role: e.target.value as Role })}
                        size="small"
                        disabled={user.id === currentUser?.id}
                      >
                        <MenuItem value="STUDENT">Student</MenuItem>
                        <MenuItem value="ADMIN">Admin</MenuItem>
                      </Select>
                    </td>
                    <td className="p-3 text-right">
                      <IconButton
                        size="small"
                        color="error"
                        disabled={user.id === currentUser?.id}
                        onClick={() => setDeleteTarget({ id: user.id, name: user.name })}
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
            {data.users.map((user) => (
              <div key={user.id} className="border rounded-lg p-4 flex flex-col gap-3" style={{ borderColor: 'inherit' }}>
                <div className="flex items-center gap-2">
                  <Avatar src={user.avatarUrl ?? undefined} sx={{ width: 32, height: 32 }}>
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>{user.name}</Typography>
                    <Typography variant="caption" color="text.secondary" className="truncate block">
                      {user.email}
                    </Typography>
                  </div>
                  <Chip
                    label={user.isVerified ? 'verified' : 'unverified'}
                    size="small"
                    className="font-mono-ui"
                    color={user.isVerified ? 'success' : 'default'}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Select
                    value={user.role}
                    onChange={(e) => updateRole.mutate({ id: user.id, role: e.target.value as Role })}
                    size="small"
                    disabled={user.id === currentUser?.id}
                  >
                    <MenuItem value="STUDENT">Student</MenuItem>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                  </Select>
                  <IconButton
                    size="small"
                    color="error"
                    disabled={user.id === currentUser?.id}
                    onClick={() => setDeleteTarget({ id: user.id, name: user.name })}
                  >
                    <DeleteOutlinedIcon fontSize="small" />
                  </IconButton>
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
        title="Delete user?"
        description={`This will permanently delete ${deleteTarget?.name}'s account, including their orders, certificates, and progress. This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteUser.isPending}
      />
    </div>
  );
};

export default AdminUsersPage;